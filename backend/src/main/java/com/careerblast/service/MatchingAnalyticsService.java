package com.careerblast.service;

import com.careerblast.dto.analytics.MatchingStatsDto;
import com.careerblast.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchingAnalyticsService {

    private final UserProfileRepository userProfileRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;

    @Cacheable(value = "matching-stats", key = "'global'")
    @Transactional(readOnly = true)
    public MatchingStatsDto getGlobalMatchingStats() {
        log.info("Calculating global matching statistics");

        long totalCandidates = userProfileRepository.countMatchingEnabledProfiles();
        long totalJobs = jobRepository.countActiveJobs();
        long totalApplications = jobApplicationRepository.count();
        long completedProfiles = userProfileRepository.countCompleteProfiles();
        Double avgProfileCompletion = userProfileRepository.getAverageProfileCompletion();

        // Calculate recent activity (last 7 days)
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        long recentApplications = jobApplicationRepository.countApplicationsAfter(weekAgo);
        long recentJobs = jobRepository.countJobsPostedAfter(weekAgo);
        long recentUsers = userRepository.countUsersRegisteredAfter(weekAgo);

        return MatchingStatsDto.builder()
                .totalActiveCandidates(totalCandidates)
                .totalActiveJobs(totalJobs)
                .totalApplications(totalApplications)
                .completedProfiles(completedProfiles)
                .averageProfileCompletion(avgProfileCompletion != null ? avgProfileCompletion : 0.0)
                .recentApplications(recentApplications)
                .recentJobsPosted(recentJobs)
                .recentUserRegistrations(recentUsers)
                .matchingSuccessRate(calculateMatchingSuccessRate())
                .build();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getMatchingMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        // Basic counts
        metrics.put("active_candidates", userProfileRepository.countMatchingEnabledProfiles());
        metrics.put("active_jobs", jobRepository.countActiveJobs());
        metrics.put("total_applications", jobApplicationRepository.count());
        
        // Profile completion metrics
        metrics.put("completed_profiles", userProfileRepository.countCompleteProfiles());
        metrics.put("avg_profile_completion", userProfileRepository.getAverageProfileCompletion());
        
        // Recent activity (last 24 hours)
        LocalDateTime dayAgo = LocalDateTime.now().minusDays(1);
        metrics.put("applications_last_24h", jobApplicationRepository.countApplicationsAfter(dayAgo));
        metrics.put("jobs_posted_last_24h", jobRepository.countJobsPostedAfter(dayAgo));
        
        // Success rates
        metrics.put("matching_success_rate", calculateMatchingSuccessRate());
        
        return metrics;
    }

    private Double calculateMatchingSuccessRate() {
        try {
            long totalApplications = jobApplicationRepository.count();
            if (totalApplications == 0) return 0.0;
            
            // Count successful applications (offered, accepted, interviewed)
            // This is a simplified calculation - in production you might want more sophisticated metrics
            return 75.0; // Placeholder - implement based on your success criteria
        } catch (Exception e) {
            log.error("Error calculating matching success rate", e);
            return 0.0;
        }
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getApplicationStatusBreakdown() {
        Map<String, Long> breakdown = new HashMap<>();
        
        // This would need to be implemented based on your specific requirements
        // For now, returning a placeholder structure
        breakdown.put("PENDING", 0L);
        breakdown.put("REVIEWING", 0L);
        breakdown.put("SHORTLISTED", 0L);
        breakdown.put("INTERVIEWED", 0L);
        breakdown.put("OFFERED", 0L);
        breakdown.put("ACCEPTED", 0L);
        breakdown.put("REJECTED", 0L);
        
        return breakdown;
    }
}
