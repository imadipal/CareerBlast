package com.mynexjob.config;

import com.theokanning.openai.service.OpenAiService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
@Slf4j
public class MatchingConfig {

    @Value("${app.openai.api-key:}")
    private String openAiApiKey;

    @Value("${app.openai.timeout:60}")
    private int timeoutSeconds;

    @Bean
    public OpenAiService openAiService() {
        if (openAiApiKey == null || openAiApiKey.trim().isEmpty()) {
            log.warn("OpenAI API key not configured. AI matching will use fallback scoring.");
            return null;
        }
        
        return new OpenAiService(openAiApiKey, Duration.ofSeconds(timeoutSeconds));
    }
}
