package com.careerblast.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.regex.Pattern;

@Configuration
public class ValidationConfig implements WebMvcConfigurer {

    @Bean
    public InputSanitizationInterceptor inputSanitizationInterceptor() {
        return new InputSanitizationInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(inputSanitizationInterceptor())
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/actuator/**");
    }

    public static class InputSanitizationInterceptor implements HandlerInterceptor {
        
        // Patterns for detecting potential security threats
        private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile(
            "(?i)(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|vbscript|onload|onerror)",
            Pattern.CASE_INSENSITIVE
        );
        
        private static final Pattern XSS_PATTERN = Pattern.compile(
            "(?i)(<script|</script|javascript:|vbscript:|onload=|onerror=|onclick=|onmouseover=)",
            Pattern.CASE_INSENSITIVE
        );
        
        private static final Pattern PATH_TRAVERSAL_PATTERN = Pattern.compile(
            "(\\.\\./|\\.\\.\\\\|%2e%2e%2f|%2e%2e%5c)",
            Pattern.CASE_INSENSITIVE
        );

        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
            // Check query parameters
            if (request.getQueryString() != null) {
                if (containsSuspiciousContent(request.getQueryString())) {
                    response.setStatus(400);
                    response.getWriter().write("{\"error\":\"Invalid request parameters detected\"}");
                    return false;
                }
            }
            
            // Check headers for suspicious content
            String userAgent = request.getHeader("User-Agent");
            if (userAgent != null && containsSuspiciousContent(userAgent)) {
                response.setStatus(400);
                response.getWriter().write("{\"error\":\"Invalid request headers detected\"}");
                return false;
            }
            
            // Check for path traversal in URI
            String requestURI = request.getRequestURI();
            if (PATH_TRAVERSAL_PATTERN.matcher(requestURI).find()) {
                response.setStatus(400);
                response.getWriter().write("{\"error\":\"Invalid request path detected\"}");
                return false;
            }
            
            return true;
        }
        
        private boolean containsSuspiciousContent(String input) {
            if (input == null) return false;
            
            return SQL_INJECTION_PATTERN.matcher(input).find() ||
                   XSS_PATTERN.matcher(input).find() ||
                   PATH_TRAVERSAL_PATTERN.matcher(input).find();
        }
    }
}
