package com.careerblast.service;

import com.careerblast.dto.common.PagedResponse;
import com.careerblast.dto.matching.CandidateMatchDto;
import com.careerblast.dto.matching.MatchResult;
import com.careerblast.entity.*;
import com.careerblast.enums.ApplicationStatus;
import com.careerblast.exception.BadRequestException;
import com.careerblast.exception.ResourceNotFoundException;
import com.careerblast.mapper.UserMapper;
import com.careerblast.repository.*;
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
public class RecruiterCandidateDiscoveryService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final CompanyRepository companyRepository;
    private final MatchingService matchingService;
    private final UserMapper userMapper;
    private final JobAccessControlService jobAccessControlService;

    @Value("${app.matching.minimum-threshold:70.0}")
    private Double minimumMatchThreshold;

    @Cacheable(value = "recruiter-candidate-matches", key = "#userEmail + '_' + #jobId + '_' + #pageable.toString()")
    @Transactional(readOnly = true)
    public PagedResponse<CandidateMatchDto> getMatchingCandidates(String userEmail, UUID jobId, Pageable pageable) {
        log.info("Getting matching candidates for recruiter: {} and job: {}", userEmail, jobId);

        User recruiter = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Job job = jobRepository.findById(jobId.toString())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        // Verify recruiter owns this job
        if (!job.getCompany().getUser().getId().equals(recruiter.getId())) {
            throw new BadRequestException("You don't have permission to view candidates for this job");
        }

        // Get all candidates with matching enabled
        List<UserProfile> candidateProfiles = userProfileRepository.findByMatchingEnabledTrue(Pageable.unpaged()).getContent();
        
        List<CandidateMatchDto> matchingCandidates = new ArrayList<>();

        for (UserProfile profile : candidateProfiles) {
            try {
                User candidate = profile.getUser();
                MatchResult matchResult = matchingService.calculateMatch(candidate, job);
                
                // Only include candidates that pass strict filters and meet minimum threshold
                if (matchResult.getPassesStrictFilters() && matchResult.getMeetsMinimumThreshold()) {
                    
                    // Check if candidate has already applied
                    boolean hasApplied = jobApplicationRepository.existsByUserIdAndJobId(candidate.getId(), jobId.toString());
                    String applicationStatus = null;
                    
                    if (hasApplied) {
                        applicationStatus = jobApplicationRepository.findByUserIdAndJobId(candidate.getId(), jobId.toString())
                                .map(app -> app.getStatus().name())
                                .orElse(null);
                    }
                    
                    CandidateMatchDto candidateMatch = CandidateMatchDto.builder()
                            .candidate(userMapper.toDto(candidate))
                            .matchPercentage(matchResult.getMatchPercentage())
                            .breakdown(matchResult.getBreakdown())
                            .matchExplanation(matchResult.getBreakdown() != null ? 
                                    matchResult.getBreakdown().getOverallExplanation() : "Match calculated")
                            .expectedSalary(profile.getExpectedSalary())
                            .experienceYears(profile.getExperienceYears())
                            .hasApplied(hasApplied)
                            .applicationStatus(applicationStatus)
                            .build();
                    
                    matchingCandidates.add(candidateMatch);
                }
            } catch (Exception e) {
                log.error("Error calculating match for candidate {} and job {}", 
                         profile.getUser().getId(), jobId, e);
            }
        }

        // Sort by match percentage (highest first), then by application status (applicants first)
        matchingCandidates.sort((a, b) -> {
            // Prioritize applicants
            if (a.getHasApplied() && !b.getHasApplied()) return -1;
            if (!a.getHasApplied() && b.getHasApplied()) return 1;
            
            // Then by match percentage
            return Double.compare(b.getMatchPercentage(), a.getMatchPercentage());
        });

        // Apply pagination
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), matchingCandidates.size());
        List<CandidateMatchDto> paginatedCandidates = matchingCandidates.subList(start, end);

        Page<CandidateMatchDto> candidatePage = new PageImpl<>(paginatedCandidates, pageable, matchingCandidates.size());

        log.info("Found {} matching candidates for job: {}", matchingCandidates.size(), jobId);

        return PagedResponse.<CandidateMatchDto>builder()
                .content(candidatePage.getContent())
                .page(candidatePage.getNumber())
                .size(candidatePage.getSize())
                .totalElements(candidatePage.getTotalElements())
                .totalPages(candidatePage.getTotalPages())
                .first(candidatePage.isFirst())
                .last(candidatePage.isLast())
                .hasNext(candidatePage.hasNext())
                .hasPrevious(candidatePage.hasPrevious())
                .build();
    }

    @Transactional(readOnly = true)
    public PagedResponse<CandidateMatchDto> getJobApplicants(String userEmail, UUID jobId, Pageable pageable) {
        log.info("Getting applicants for recruiter: {} and job: {}", userEmail, jobId);

        User recruiter = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Job job = jobRepository.findById(jobId.toString())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        // Verify recruiter owns this job OR has subscription access for IT jobs
        if (!job.getCompany().getUser().getId().equals(recruiter.getId())) {
            // Check if recruiter can access this job's applications
            if (!jobAccessControlService.canAccessJob(recruiter, job)) {
                String restrictionMessage = jobAccessControlService.getAccessRestrictionMessage(recruiter, job);
                throw new BadRequestException(restrictionMessage != null ? restrictionMessage :
                    "You don't have permission to view applicants for this job");
            }
        }

        Page<JobApplication> applications = jobApplicationRepository.findByJobId(jobId.toString(), pageable);
        
        List<CandidateMatchDto> applicants = applications.getContent().stream()
                .map(application -> {
                    User candidate = application.getUser();
                    UserProfile profile = candidate.getUserProfile();

                    // Check if recruiter can access this application data
                    boolean canAccessApplication = jobAccessControlService.canAccessJobApplication(recruiter, application);

                    // Calculate match for context (even if they already applied)
                    MatchResult matchResult = null;
                    try {
                        if (canAccessApplication) {
                            matchResult = matchingService.calculateMatch(candidate, job);
                        }
                    } catch (Exception e) {
                        log.error("Error calculating match for applicant {} and job {}",
                                 candidate.getId(), jobId, e);
                    }

                    // If no access, return limited data
                    if (!canAccessApplication) {
                        return CandidateMatchDto.builder()
                                .candidate(null) // Hide candidate details
                                .matchPercentage(0.0)
                                .breakdown(null)
                                .matchExplanation("Subscription required to view IT job candidate data")
                                .expectedSalary(null)
                                .experienceYears(null)
                                .hasApplied(true)
                                .applicationStatus("RESTRICTED")
                                .build();
                    }

                    return CandidateMatchDto.builder()
                            .candidate(userMapper.toDto(candidate))
                            .matchPercentage(matchResult != null ? matchResult.getMatchPercentage() : 0.0)
                            .breakdown(matchResult != null ? matchResult.getBreakdown() : null)
                            .matchExplanation(matchResult != null && matchResult.getBreakdown() != null ?
                                    matchResult.getBreakdown().getOverallExplanation() : "Match not calculated")
                            .expectedSalary(profile != null ? profile.getExpectedSalary() : null)
                            .experienceYears(profile != null ? profile.getExperienceYears() : null)
                            .hasApplied(true)
                            .applicationStatus(application.getStatus().name())
                            .build();
                })
                .collect(Collectors.toList());

        return PagedResponse.<CandidateMatchDto>builder()
                .content(applicants)
                .page(applications.getNumber())
                .size(applications.getSize())
                .totalElements(applications.getTotalElements())
                .totalPages(applications.getTotalPages())
                .first(applications.isFirst())
                .last(applications.isLast())
                .hasNext(applications.hasNext())
                .hasPrevious(applications.hasPrevious())
                .build();
    }

    @Transactional(readOnly = true)
    public List<CandidateMatchDto> getTopCandidatesForJob(String userEmail, UUID jobId, int limit) {
        log.info("Getting top {} candidates for recruiter: {} and job: {}", limit, userEmail, jobId);

        User recruiter = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Job job = jobRepository.findById(jobId.toString())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        // Verify recruiter owns this job
        if (!job.getCompany().getUser().getId().equals(recruiter.getId())) {
            throw new BadRequestException("You don't have permission to view candidates for this job");
        }

        List<UserProfile> candidateProfiles = userProfileRepository.findByMatchingEnabledTrue(Pageable.unpaged()).getContent();
        
        List<CandidateMatchDto> topCandidates = new ArrayList<>();

        for (UserProfile profile : candidateProfiles) {
            try {
                User candidate = profile.getUser();
                MatchResult matchResult = matchingService.calculateMatch(candidate, job);
                
                if (matchResult.getPassesStrictFilters() && matchResult.getMeetsMinimumThreshold()) {
                    boolean hasApplied = jobApplicationRepository.existsByUserIdAndJobId(candidate.getId(), jobId.toString());
                    
                    CandidateMatchDto candidateMatch = CandidateMatchDto.builder()
                            .candidate(userMapper.toDto(candidate))
                            .matchPercentage(matchResult.getMatchPercentage())
                            .breakdown(matchResult.getBreakdown())
                            .matchExplanation(matchResult.getBreakdown() != null ? 
                                    matchResult.getBreakdown().getOverallExplanation() : "Match calculated")
                            .expectedSalary(profile.getExpectedSalary())
                            .experienceYears(profile.getExperienceYears())
                            .hasApplied(hasApplied)
                            .build();
                    
                    topCandidates.add(candidateMatch);
                }
            } catch (Exception e) {
                log.error("Error calculating match for candidate {} and job {}", 
                         profile.getUser().getId(), jobId, e);
            }
        }

        return topCandidates.stream()
                .sorted((a, b) -> Double.compare(b.getMatchPercentage(), a.getMatchPercentage()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getMatchingCandidatesCount(String userEmail, UUID jobId) {
        User recruiter = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Job job = jobRepository.findById(jobId.toString())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!job.getCompany().getUser().getId().equals(recruiter.getId())) {
            throw new BadRequestException("You don't have permission to view candidates for this job");
        }

        List<UserProfile> candidateProfiles = userProfileRepository.findByMatchingEnabledTrue(Pageable.unpaged()).getContent();
        
        return candidateProfiles.stream()
                .mapToLong(profile -> {
                    try {
                        MatchResult matchResult = matchingService.calculateMatch(profile.getUser(), job);
                        return (matchResult.getPassesStrictFilters() && matchResult.getMeetsMinimumThreshold()) ? 1 : 0;
                    } catch (Exception e) {
                        return 0;
                    }
                })
                .sum();
    }
}
