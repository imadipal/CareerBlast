package com.careerblast.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Configuration
public class RateLimitingConfig implements WebMvcConfigurer {

    @Bean
    public RateLimitingInterceptor rateLimitingInterceptor() {
        return new RateLimitingInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(rateLimitingInterceptor())
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/health", "/api/actuator/**");
    }

    public static class RateLimitingInterceptor implements HandlerInterceptor {
        
        private final ConcurrentHashMap<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
        private final ConcurrentHashMap<String, Long> lastRequestTime = new ConcurrentHashMap<>();
        private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        
        // Rate limiting configuration
        private final int MAX_REQUESTS_PER_MINUTE = 100;
        private final int MAX_REQUESTS_PER_HOUR = 1000;
        private final long MINUTE_IN_MILLIS = 60 * 1000;
        private final long HOUR_IN_MILLIS = 60 * 60 * 1000;

        public RateLimitingInterceptor() {
            // Clean up old entries every 5 minutes
            scheduler.scheduleAtFixedRate(this::cleanupOldEntries, 5, 5, TimeUnit.MINUTES);
        }

        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
            String clientId = getClientIdentifier(request);
            long currentTime = System.currentTimeMillis();
            
            // Check rate limits
            if (isRateLimited(clientId, currentTime)) {
                response.setStatus(429); // Too Many Requests
                response.setHeader("X-RateLimit-Limit", String.valueOf(MAX_REQUESTS_PER_MINUTE));
                response.setHeader("X-RateLimit-Remaining", "0");
                response.setHeader("X-RateLimit-Reset", String.valueOf(getResetTime(currentTime)));
                response.getWriter().write("{\"error\":\"Rate limit exceeded. Please try again later.\"}");
                return false;
            }

            // Update request count
            requestCounts.computeIfAbsent(clientId, k -> new AtomicInteger(0)).incrementAndGet();
            lastRequestTime.put(clientId, currentTime);
            
            // Add rate limit headers
            int remaining = Math.max(0, MAX_REQUESTS_PER_MINUTE - requestCounts.get(clientId).get());
            response.setHeader("X-RateLimit-Limit", String.valueOf(MAX_REQUESTS_PER_MINUTE));
            response.setHeader("X-RateLimit-Remaining", String.valueOf(remaining));
            response.setHeader("X-RateLimit-Reset", String.valueOf(getResetTime(currentTime)));

            return true;
        }

        private String getClientIdentifier(HttpServletRequest request) {
            // Try to get real IP from headers (for load balancers/proxies)
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                return xForwardedFor.split(",")[0].trim();
            }
            
            String xRealIp = request.getHeader("X-Real-IP");
            if (xRealIp != null && !xRealIp.isEmpty()) {
                return xRealIp;
            }
            
            return request.getRemoteAddr();
        }

        private boolean isRateLimited(String clientId, long currentTime) {
            AtomicInteger count = requestCounts.get(clientId);
            Long lastRequest = lastRequestTime.get(clientId);
            
            if (count == null || lastRequest == null) {
                return false;
            }

            // Check if we need to reset the counter (1 minute window)
            if (currentTime - lastRequest > MINUTE_IN_MILLIS) {
                requestCounts.put(clientId, new AtomicInteger(0));
                return false;
            }

            // Check rate limit
            return count.get() >= MAX_REQUESTS_PER_MINUTE;
        }

        private long getResetTime(long currentTime) {
            return currentTime + MINUTE_IN_MILLIS;
        }

        private void cleanupOldEntries() {
            long currentTime = System.currentTimeMillis();
            lastRequestTime.entrySet().removeIf(entry -> 
                currentTime - entry.getValue() > HOUR_IN_MILLIS);
            
            // Remove corresponding request counts
            requestCounts.entrySet().removeIf(entry -> 
                !lastRequestTime.containsKey(entry.getKey()));
        }
    }
}
