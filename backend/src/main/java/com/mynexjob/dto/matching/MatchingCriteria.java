package com.mynexjob.dto.matching;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchingCriteria {
    
    // Strict filters
    private BigDecimal expectedSalary;
    private BigDecimal offeredSalary;
    private Integer candidateExperience;
    private Integer requiredExperience;
    
    // AI matching data
    private String candidateSkills;
    private String candidateEducation;
    private String candidateExperienceSummary;
    private String candidateSummary;
    
    private String jobTitle;
    private String jobDescription;
    private String jobRequirements;
    private String jobResponsibilities;
    private String requiredSkills;
    
    // Additional context
    private String jobLocation;
    private String candidateLocation;
    private Boolean isRemoteJob;
    private Boolean candidateOpenToRemote;
    private String jobType;
    private List<String> candidatePreferredJobTypes;
}
