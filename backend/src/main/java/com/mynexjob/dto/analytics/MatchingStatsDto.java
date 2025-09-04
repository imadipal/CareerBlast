package com.mynexjob.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchingStatsDto {
    private Long totalActiveCandidates;
    private Long totalActiveJobs;
    private Long totalApplications;
    private Long completedProfiles;
    private Double averageProfileCompletion;
    private Long recentApplications;
    private Long recentJobsPosted;
    private Long recentUserRegistrations;
    private Double matchingSuccessRate;
}
