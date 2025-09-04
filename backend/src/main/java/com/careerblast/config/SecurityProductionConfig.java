package com.careerblast.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@Profile("prod")
public class SecurityProductionConfig {

    @Bean
    public SecurityFilterChain productionSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            // Security Headers
            .headers(headers -> headers
                .frameOptions().deny()
                .contentTypeOptions().and()
                .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                    .maxAgeInSeconds(31536000)
                )
                .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
                .and()
                .addHeaderWriter((request, response) -> {
                    // Content Security Policy
                    response.setHeader("Content-Security-Policy", 
                        "default-src 'self'; " +
                        "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; " +
                        "style-src 'self' 'unsafe-inline'; " +
                        "img-src 'self' data: https:; " +
                        "font-src 'self' https:; " +
                        "connect-src 'self' https://api.razorpay.com; " +
                        "frame-src https://api.razorpay.com;"
                    );
                    
                    // Additional Security Headers
                    response.setHeader("X-Content-Type-Options", "nosniff");
                    response.setHeader("X-Frame-Options", "DENY");
                    response.setHeader("X-XSS-Protection", "1; mode=block");
                    response.setHeader("Permissions-Policy", 
                        "geolocation=(), microphone=(), camera=()");
                })
            )
            
            // CORS Configuration
            .cors(cors -> cors.configurationSource(productionCorsConfigurationSource()))
            
            // CSRF Protection (disabled for API, but could be enabled for web endpoints)
            .csrf().disable()
            
            // Session Management
            .sessionManagement().sessionCreationPolicy(
                org.springframework.security.config.http.SessionCreationPolicy.STATELESS
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource productionCorsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Only allow specific production domains
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "https://careerblast.com",
            "https://www.careerblast.com",
            "https://*.careerblast.com"
        ));
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
