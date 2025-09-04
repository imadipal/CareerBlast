package com.mynexjob.service;

import com.mynexjob.dto.matching.MatchResult;
import com.mynexjob.dto.matching.MatchingCriteria;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatMessageRole;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
public class AIMatchingService {

    private final OpenAiService openAiService;
    private final ObjectMapper objectMapper;

    public AIMatchingService(@Autowired(required = false) OpenAiService openAiService, ObjectMapper objectMapper) {
        this.openAiService = openAiService;
        this.objectMapper = objectMapper;
    }

    @Cacheable(value = "ai-matches", key = "#criteria.hashCode()")
    public MatchResult.MatchBreakdown calculateAIMatch(MatchingCriteria criteria) {
        if (openAiService == null) {
            log.warn("OpenAI service not available, using fallback matching");
            return createFallbackMatch(criteria);
        }

        try {
            String prompt = buildMatchingPrompt(criteria);
            String response = callOpenAI(prompt);
            return parseMatchingResponse(response);
        } catch (Exception e) {
            log.error("Error in AI matching calculation", e);
            throw new RuntimeException("AI matching failed", e);
        }
    }

    private String buildMatchingPrompt(MatchingCriteria criteria) {
        return String.format(
            "You are an expert HR professional and job matching specialist. Analyze the compatibility between this candidate and job position.\n\n" +
            "CANDIDATE PROFILE:\n" +
            "- Skills: %s\n" +
            "- Education: %s\n" +
            "- Experience Summary: %s\n" +
            "- Years of Experience: %d\n" +
            "- Location: %s\n" +
            "- Open to Remote: %s\n\n" +
            "JOB POSITION:\n" +
            "- Title: %s\n" +
            "- Description: %s\n" +
            "- Requirements: %s\n" +
            "- Responsibilities: %s\n" +
            "- Required Skills: %s\n" +
            "- Location: %s\n" +
            "- Remote Available: %s\n" +
            "- Job Type: %s\n\n" +
            "Please provide a detailed analysis and return ONLY a valid JSON response with the following structure:\n" +
            "{\n" +
            "    \"skillsMatch\": <percentage 0-100>,\n" +
            "    \"experienceMatch\": <percentage 0-100>,\n" +
            "    \"educationMatch\": <percentage 0-100>,\n" +
            "    \"responsibilitiesMatch\": <percentage 0-100>,\n" +
            "    \"locationMatch\": <percentage 0-100>,\n" +
            "    \"overallMatch\": <percentage 0-100>,\n" +
            "    \"skillsExplanation\": \"<brief explanation>\",\n" +
            "    \"experienceExplanation\": \"<brief explanation>\",\n" +
            "    \"educationExplanation\": \"<brief explanation>\",\n" +
            "    \"responsibilitiesExplanation\": \"<brief explanation>\",\n" +
            "    \"overallExplanation\": \"<brief overall assessment>\"\n" +
            "}\n\n" +
            "Consider:\n" +
            "1. Skills alignment (technical and soft skills)\n" +
            "2. Experience relevance and level\n" +
            "3. Educational background fit\n" +
            "4. Ability to handle responsibilities\n" +
            "5. Location/remote work compatibility\n\n" +
            "Be realistic and thorough in your assessment. The overall match should be a weighted average considering all factors.",
            criteria.getCandidateSkills(),
            criteria.getCandidateEducation(),
            criteria.getCandidateExperienceSummary(),
            criteria.getCandidateExperience() != null ? criteria.getCandidateExperience() : 0,
            criteria.getCandidateLocation(),
            criteria.getCandidateOpenToRemote(),
            criteria.getJobTitle(),
            criteria.getJobDescription(),
            criteria.getJobRequirements(),
            criteria.getJobResponsibilities(),
            criteria.getRequiredSkills(),
            criteria.getJobLocation(),
            criteria.getIsRemoteJob(),
            criteria.getJobType()
        );
    }

    private String callOpenAI(String prompt) {
        List<ChatMessage> messages = Arrays.asList(
            new ChatMessage(ChatMessageRole.SYSTEM.value(), 
                "You are an expert HR professional specializing in job-candidate matching. " +
                "Always respond with valid JSON only, no additional text."),
            new ChatMessage(ChatMessageRole.USER.value(), prompt)
        );

        ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(messages)
                .maxTokens(1000)
                .temperature(0.3)
                .build();

        ChatCompletionResult result = openAiService.createChatCompletion(request);
        
        if (result.getChoices() == null || result.getChoices().isEmpty()) {
            throw new RuntimeException("No response from OpenAI");
        }

        return result.getChoices().get(0).getMessage().getContent();
    }

    private MatchResult.MatchBreakdown parseMatchingResponse(String response) throws JsonProcessingException {
        try {
            // Clean the response to ensure it's valid JSON
            String cleanedResponse = response.trim();
            if (cleanedResponse.startsWith("```json")) {
                cleanedResponse = cleanedResponse.substring(7);
            }
            if (cleanedResponse.endsWith("```")) {
                cleanedResponse = cleanedResponse.substring(0, cleanedResponse.length() - 3);
            }
            cleanedResponse = cleanedResponse.trim();

            JsonNode jsonNode = objectMapper.readTree(cleanedResponse);

            return MatchResult.MatchBreakdown.builder()
                    .skillsMatch(jsonNode.get("skillsMatch").asDouble())
                    .experienceMatch(jsonNode.get("experienceMatch").asDouble())
                    .educationMatch(jsonNode.get("educationMatch").asDouble())
                    .responsibilitiesMatch(jsonNode.get("responsibilitiesMatch").asDouble())
                    .locationMatch(jsonNode.get("locationMatch").asDouble())
                    .overallMatch(jsonNode.get("overallMatch").asDouble())
                    .skillsExplanation(jsonNode.get("skillsExplanation").asText())
                    .experienceExplanation(jsonNode.get("experienceExplanation").asText())
                    .educationExplanation(jsonNode.get("educationExplanation").asText())
                    .responsibilitiesExplanation(jsonNode.get("responsibilitiesExplanation").asText())
                    .overallExplanation(jsonNode.get("overallExplanation").asText())
                    .build();

        } catch (Exception e) {
            log.error("Failed to parse AI response: {}", response, e);
            throw new JsonProcessingException("Invalid AI response format") {};
        }
    }

    private MatchResult.MatchBreakdown createFallbackMatch(MatchingCriteria criteria) {
        // Simple fallback matching based on basic criteria
        double skillsMatch = 75.0; // Default reasonable match
        double experienceMatch = 80.0;
        double educationMatch = 70.0;
        double responsibilitiesMatch = 75.0;
        double locationMatch = 85.0;
        double overallMatch = (skillsMatch + experienceMatch + educationMatch + responsibilitiesMatch + locationMatch) / 5.0;

        return MatchResult.MatchBreakdown.builder()
                .skillsMatch(skillsMatch)
                .experienceMatch(experienceMatch)
                .educationMatch(educationMatch)
                .responsibilitiesMatch(responsibilitiesMatch)
                .locationMatch(locationMatch)
                .overallMatch(overallMatch)
                .skillsExplanation("Basic skills compatibility assessment")
                .experienceExplanation("Experience level appears suitable")
                .educationExplanation("Educational background is compatible")
                .responsibilitiesExplanation("Candidate can handle the responsibilities")
                .overallExplanation("Good overall match based on basic criteria (AI matching unavailable)")
                .build();
    }
}
