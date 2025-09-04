package com.mynexjob.dto.matching;

import com.mynexjob.dto.user.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateMatchDto {
    
    private UserDto candidate;
    private Double matchPercentage;
    private MatchResult.MatchBreakdown breakdown;
    private String matchExplanation;
    
    // Visible to recruiters only
    private BigDecimal expectedSalary;
    private Integer experienceYears;
    private Boolean hasApplied;
    private String applicationStatus;
}
