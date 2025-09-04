package com.careerblast.dto.matching;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchResult {
    
    private String candidateId;
    private String jobId;
    private Double matchPercentage;
    private Boolean passesStrictFilters;
    private Boolean meetsMinimumThreshold;
    
    // Breakdown of match components
    private MatchBreakdown breakdown;
    
    // Reasons for filtering
    private List<String> filterReasons;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MatchBreakdown {
        private Double skillsMatch;
        private Double experienceMatch;
        private Double educationMatch;
        private Double responsibilitiesMatch;
        private Double locationMatch;
        private Double overallMatch;
        
        // Detailed explanations
        private String skillsExplanation;
        private String experienceExplanation;
        private String educationExplanation;
        private String responsibilitiesExplanation;
        private String overallExplanation;
    }
}
