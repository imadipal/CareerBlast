package com.careerblast.dto.matching;

import com.careerblast.dto.job.JobDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobMatchDto {
    
    private JobDto job;
    private Double matchPercentage;
    private MatchResult.MatchBreakdown breakdown;
    private String matchExplanation;
    
    // Hide sensitive information from candidates
    private Boolean salaryMatches; // Don't show actual offered salary
    private Boolean experienceMatches;
}
