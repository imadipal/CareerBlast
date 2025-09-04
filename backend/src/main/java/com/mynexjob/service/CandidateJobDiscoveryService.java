package com.mynexjob.service;

import com.mynexjob.dto.common.PagedResponse;
import com.mynexjob.dto.matching.JobMatchDto;
import com.mynexjob.dto.matching.MatchResult;
import com.mynexjob.entity.Job;
import com.mynexjob.entity.User;
import com.mynexjob.entity.UserProfile;
import com.mynexjob.exception.BadRequestException;
import com.mynexjob.exception.ResourceNotFoundException;
import com.mynexjob.mapper.JobMapper;
import com.mynexjob.repository.JobRepository;
import com.mynexjob.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateJobDiscoveryService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final MatchingService matchingService;
    private final JobMapper jobMapper;

    @Value("${app.matching.minimum-threshold:70.0}")
    private Double minimumMatchThreshold;

    @Cacheable(value = "candidate-job-matches", key = "#userEmail + '_' + #pageable.toString()")
    @Transactional(readOnly = true)
    public PagedResponse<JobMatchDto> getRecommendedJobs(String userEmail, Pageable pageable) {
        log.info("Getting recommended jobs for candidate: {}", userEmail);

        User candidate = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfile profile = candidate.getUserProfile();
        if (profile == null || !profile.getMatchingEnabled()) {
            throw new BadRequestException("Profile not complete or matching not enabled. " +
                    "Please complete your profile and enable matching to see job recommendations.");
        }

        // Get all active jobs that have matching enabled
        List<Job> allJobs = jobRepository.findByIsActiveTrueAndMatchingEnabledTrue();
        
        List<JobMatchDto> matchedJobs = new ArrayList<>();

        for (Job job : allJobs) {
            try {
                MatchResult matchResult = matchingService.calculateMatch(candidate, job);
                
                // Only include jobs that pass strict filters and meet minimum threshold
                if (matchResult.getPassesStrictFilters() && matchResult.getMeetsMinimumThreshold()) {
                    JobMatchDto jobMatch = JobMatchDto.builder()
                            .job(jobMapper.toDto(job))
                            .matchPercentage(matchResult.getMatchPercentage())
                            .breakdown(matchResult.getBreakdown())
                            .matchExplanation(matchResult.getBreakdown() != null ? 
                                    matchResult.getBreakdown().getOverallExplanation() : "Match calculated")
                            .salaryMatches(true) // They passed salary filter
                            .experienceMatches(true) // They passed experience filter
                            .build();
                    
                    matchedJobs.add(jobMatch);
                }
            } catch (Exception e) {
                log.error("Error calculating match for job {} and candidate {}", 
                         job.getId(), candidate.getId(), e);
            }
        }

        // Sort by match percentage (highest first)
        matchedJobs.sort((a, b) -> Double.compare(b.getMatchPercentage(), a.getMatchPercentage()));

        // Apply pagination
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), matchedJobs.size());
        List<JobMatchDto> paginatedJobs = matchedJobs.subList(start, end);

        Page<JobMatchDto> jobPage = new PageImpl<>(paginatedJobs, pageable, matchedJobs.size());

        log.info("Found {} matching jobs for candidate: {}", matchedJobs.size(), userEmail);

        return PagedResponse.<JobMatchDto>builder()
                .content(jobPage.getContent())
                .page(jobPage.getNumber())
                .size(jobPage.getSize())
                .totalElements(jobPage.getTotalElements())
                .totalPages(jobPage.getTotalPages())
                .first(jobPage.isFirst())
                .last(jobPage.isLast())
                .hasNext(jobPage.hasNext())
                .hasPrevious(jobPage.hasPrevious())
                .build();
    }

    @Transactional(readOnly = true)
    public JobMatchDto getJobMatch(String userEmail, UUID jobId) {
        log.info("Getting job match for candidate: {} and job: {}", userEmail, jobId);

        User candidate = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfile profile = candidate.getUserProfile();
        if (profile == null || !profile.getMatchingEnabled()) {
            throw new BadRequestException("Profile not complete or matching not enabled.");
        }

        Job job = jobRepository.findByIdAndIsActiveTrue(jobId.toString())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        MatchResult matchResult = matchingService.calculateMatch(candidate, job);

        if (!matchResult.getPassesStrictFilters()) {
            throw new BadRequestException("You don't meet the basic requirements for this job: " + 
                    String.join(", ", matchResult.getFilterReasons()));
        }

        if (!matchResult.getMeetsMinimumThreshold()) {
            throw new BadRequestException("Your profile match is below the minimum threshold of " + 
                    minimumMatchThreshold + "%");
        }

        return JobMatchDto.builder()
                .job(jobMapper.toDto(job))
                .matchPercentage(matchResult.getMatchPercentage())
                .breakdown(matchResult.getBreakdown())
                .matchExplanation(matchResult.getBreakdown() != null ? 
                        matchResult.getBreakdown().getOverallExplanation() : "Match calculated")
                .salaryMatches(true)
                .experienceMatches(true)
                .build();
    }

    @Transactional(readOnly = true)
    public List<JobMatchDto> getTopMatches(String userEmail, int limit) {
        log.info("Getting top {} matches for candidate: {}", limit, userEmail);

        User candidate = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfile profile = candidate.getUserProfile();
        if (profile == null || !profile.getMatchingEnabled()) {
            return new ArrayList<>();
        }

        // Get featured jobs first, then regular jobs
        List<Job> featuredJobs = jobRepository.findByIsActiveTrueAndIsFeaturedTrueAndMatchingEnabledTrue()
                .stream().limit(limit / 2).collect(Collectors.toList());
        
        List<Job> regularJobs = jobRepository.findByIsActiveTrueAndIsFeaturedFalseAndMatchingEnabledTrue()
                .stream().limit(limit - featuredJobs.size()).collect(Collectors.toList());

        List<Job> allJobs = new ArrayList<>();
        allJobs.addAll(featuredJobs);
        allJobs.addAll(regularJobs);

        List<JobMatchDto> topMatches = new ArrayList<>();

        for (Job job : allJobs) {
            try {
                MatchResult matchResult = matchingService.calculateMatch(candidate, job);
                
                if (matchResult.getPassesStrictFilters() && matchResult.getMeetsMinimumThreshold()) {
                    JobMatchDto jobMatch = JobMatchDto.builder()
                            .job(jobMapper.toDto(job))
                            .matchPercentage(matchResult.getMatchPercentage())
                            .breakdown(matchResult.getBreakdown())
                            .matchExplanation(matchResult.getBreakdown() != null ? 
                                    matchResult.getBreakdown().getOverallExplanation() : "Match calculated")
                            .salaryMatches(true)
                            .experienceMatches(true)
                            .build();
                    
                    topMatches.add(jobMatch);
                }
            } catch (Exception e) {
                log.error("Error calculating match for job {} and candidate {}", 
                         job.getId(), candidate.getId(), e);
            }
        }

        // Sort by match percentage and return top matches
        return topMatches.stream()
                .sorted((a, b) -> Double.compare(b.getMatchPercentage(), a.getMatchPercentage()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getMatchingJobsCount(String userEmail) {
        User candidate = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfile profile = candidate.getUserProfile();
        if (profile == null || !profile.getMatchingEnabled()) {
            return 0;
        }

        List<Job> allJobs = jobRepository.findByIsActiveTrueAndMatchingEnabledTrue();
        
        return allJobs.stream()
                .mapToLong(job -> {
                    try {
                        MatchResult matchResult = matchingService.calculateMatch(candidate, job);
                        return (matchResult.getPassesStrictFilters() && matchResult.getMeetsMinimumThreshold()) ? 1 : 0;
                    } catch (Exception e) {
                        return 0;
                    }
                })
                .sum();
    }
}
