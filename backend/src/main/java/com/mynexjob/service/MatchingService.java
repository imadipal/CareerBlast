package com.mynexjob.service;

import com.mynexjob.dto.matching.MatchResult;
import com.mynexjob.dto.matching.MatchingCriteria;
import com.mynexjob.entity.Job;
import com.mynexjob.entity.User;
import com.mynexjob.entity.UserProfile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchingService {

    private final AIMatchingService aiMatchingService;

    @Value("${app.matching.minimum-threshold:70.0}")
    private Double minimumMatchThreshold;

    @Value("${app.matching.enable-ai:true}")
    private Boolean enableAI;

    /**
     * Calculate match between a candidate and a job
     */
    public MatchResult calculateMatch(User candidate, Job job) {
        log.debug("Calculating match between candidate {} and job {}", 
                 candidate.getId(), job.getId());

        UserProfile profile = candidate.getUserProfile();
        if (profile == null) {
            log.warn("Candidate {} has no profile", candidate.getId());
            return createNoMatchResult(candidate.getId(), job.getId(),
                                     List.of("Candidate profile not complete"));
        }

        // Step 1: Apply strict filters
        List<String> filterReasons = new ArrayList<>();
        boolean passesStrictFilters = applyStrictFilters(profile, job, filterReasons);

        if (!passesStrictFilters) {
            log.debug("Candidate {} failed strict filters for job {}: {}", 
                     candidate.getId(), job.getId(), filterReasons);
            return createFilteredResult(candidate.getId(), job.getId(), filterReasons);
        }

        // Step 2: Calculate AI-powered match percentage
        MatchingCriteria criteria = buildMatchingCriteria(candidate, profile, job);
        MatchResult.MatchBreakdown breakdown = calculateMatchBreakdown(criteria);

        double overallMatch = breakdown.getOverallMatch();
        boolean meetsThreshold = overallMatch >= minimumMatchThreshold;

        log.debug("Match calculated: {}% for candidate {} and job {}", 
                 overallMatch, candidate.getId(), job.getId());

        return MatchResult.builder()
                .candidateId(candidate.getId())
                .jobId(job.getId())
                .matchPercentage(overallMatch)
                .passesStrictFilters(true)
                .meetsMinimumThreshold(meetsThreshold)
                .breakdown(breakdown)
                .filterReasons(new ArrayList<>())
                .build();
    }

    /**
     * Apply strict filtering rules (salary and experience)
     */
    private boolean applyStrictFilters(UserProfile profile, Job job, List<String> reasons) {
        boolean passes = true;

        // Salary filter: job offered salary >= candidate expected salary
        if (profile.getExpectedSalary() != null && job.getSalaryMax() != null) {
            if (job.getSalaryMax().compareTo(profile.getExpectedSalary()) < 0) {
                reasons.add("Offered salary below expectation");
                passes = false;
            }
        } else if (profile.getExpectedSalary() != null && job.getSalaryMin() != null) {
            if (job.getSalaryMin().compareTo(profile.getExpectedSalary()) < 0) {
                reasons.add("Offered salary below expectation");
                passes = false;
            }
        }

        // Experience filter: candidate experience >= required experience
        if (profile.getExperienceYears() != null && job.getExperienceMin() != null) {
            if (profile.getExperienceYears() < job.getExperienceMin()) {
                reasons.add("Insufficient experience");
                passes = false;
            }
        }

        return passes;
    }

    /**
     * Build matching criteria for AI analysis
     */
    private MatchingCriteria buildMatchingCriteria(User candidate, UserProfile profile, Job job) {
        return MatchingCriteria.builder()
                .expectedSalary(profile.getExpectedSalary())
                .offeredSalary(job.getSalaryMax() != null ? job.getSalaryMax() : job.getSalaryMin())
                .candidateExperience(profile.getExperienceYears())
                .requiredExperience(job.getExperienceMin())
                
                .candidateSkills(profile.getSkills().stream()
                        .collect(Collectors.joining(", ")))
                .candidateEducation(profile.getEducations().stream()
                        .map(edu -> edu.getDegree() + " in " + edu.getFieldOfStudy())
                        .collect(Collectors.joining("; ")))
                .candidateSummary(profile.getSummary())
                
                .jobTitle(job.getTitle())
                .jobDescription(job.getDescription())
                .jobRequirements(job.getRequirements())
                .jobResponsibilities(job.getResponsibilities())
                .requiredSkills(job.getRequiredSkills().stream()
                        .collect(Collectors.joining(", ")))
                
                .jobLocation(job.getLocation())
                .candidateLocation(candidate.getLocation())
                .isRemoteJob(job.getIsRemote())
                .candidateOpenToRemote(profile.getIsOpenToRemote())
                .jobType(job.getJobType().name())
                .build();
    }

    /**
     * Calculate detailed match breakdown
     */
    private MatchResult.MatchBreakdown calculateMatchBreakdown(MatchingCriteria criteria) {
        if (enableAI) {
            try {
                return aiMatchingService.calculateAIMatch(criteria);
            } catch (Exception e) {
                log.error("AI matching failed, falling back to rule-based matching", e);
            }
        }

        // Fallback to rule-based matching
        return calculateRuleBasedMatch(criteria);
    }

    /**
     * Rule-based matching as fallback
     */
    private MatchResult.MatchBreakdown calculateRuleBasedMatch(MatchingCriteria criteria) {
        double skillsMatch = calculateSkillsMatch(criteria.getCandidateSkills(), criteria.getRequiredSkills());
        double experienceMatch = calculateExperienceMatch(criteria.getCandidateExperience(), criteria.getRequiredExperience());
        double locationMatch = calculateLocationMatch(criteria);
        
        // Weighted average
        double overallMatch = (skillsMatch * 0.5) + (experienceMatch * 0.3) + (locationMatch * 0.2);

        return MatchResult.MatchBreakdown.builder()
                .skillsMatch(skillsMatch)
                .experienceMatch(experienceMatch)
                .educationMatch(75.0) // Default value
                .responsibilitiesMatch(70.0) // Default value
                .locationMatch(locationMatch)
                .overallMatch(overallMatch)
                .skillsExplanation("Skills match based on keyword overlap")
                .experienceExplanation("Experience match based on years")
                .educationExplanation("Education match estimated")
                .responsibilitiesExplanation("Responsibilities match estimated")
                .overallExplanation("Overall match calculated using weighted average")
                .build();
    }

    private double calculateSkillsMatch(String candidateSkills, String requiredSkills) {
        if (candidateSkills == null || requiredSkills == null) return 50.0;
        
        String[] candidateSkillArray = candidateSkills.toLowerCase().split(",\\s*");
        String[] requiredSkillArray = requiredSkills.toLowerCase().split(",\\s*");
        
        int matches = 0;
        for (String required : requiredSkillArray) {
            for (String candidate : candidateSkillArray) {
                if (candidate.contains(required.trim()) || required.trim().contains(candidate)) {
                    matches++;
                    break;
                }
            }
        }
        
        return Math.min(100.0, (matches * 100.0) / requiredSkillArray.length);
    }

    private double calculateExperienceMatch(Integer candidateExp, Integer requiredExp) {
        if (candidateExp == null || requiredExp == null) return 75.0;
        if (candidateExp >= requiredExp) return 100.0;
        return Math.max(0.0, (candidateExp * 100.0) / requiredExp);
    }

    private double calculateLocationMatch(MatchingCriteria criteria) {
        if (Boolean.TRUE.equals(criteria.getIsRemoteJob()) && 
            Boolean.TRUE.equals(criteria.getCandidateOpenToRemote())) {
            return 100.0;
        }
        if (criteria.getJobLocation() != null && criteria.getCandidateLocation() != null) {
            return criteria.getJobLocation().toLowerCase()
                    .contains(criteria.getCandidateLocation().toLowerCase()) ? 100.0 : 60.0;
        }
        return 70.0;
    }

    private MatchResult createNoMatchResult(String candidateId, String jobId, List<String> reasons) {
        return MatchResult.builder()
                .candidateId(candidateId)
                .jobId(jobId)
                .matchPercentage(0.0)
                .passesStrictFilters(false)
                .meetsMinimumThreshold(false)
                .filterReasons(reasons)
                .build();
    }

    private MatchResult createFilteredResult(String candidateId, String jobId, List<String> reasons) {
        return MatchResult.builder()
                .candidateId(candidateId)
                .jobId(jobId)
                .matchPercentage(0.0)
                .passesStrictFilters(false)
                .meetsMinimumThreshold(false)
                .filterReasons(reasons)
                .build();
    }
}
