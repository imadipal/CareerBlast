package com.careerblast.controller;

import com.careerblast.dto.common.ApiResponse;
import com.careerblast.dto.common.PagedResponse;
import com.careerblast.dto.matching.JobMatchDto;
import com.careerblast.service.CandidateJobDiscoveryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/candidates")
@RequiredArgsConstructor
@Tag(name = "Candidate Discovery", description = "Job discovery and matching APIs for candidates")
@PreAuthorize("hasRole('USER')")
public class CandidateController {

    private final CandidateJobDiscoveryService candidateJobDiscoveryService;

    @GetMapping("/recommended-jobs")
    @Operation(summary = "Get recommended jobs for candidate", 
               description = "Returns jobs that match candidate profile with 70%+ match score",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<PagedResponse<JobMatchDto>>> getRecommendedJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "matchPercentage") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            Authentication authentication) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PagedResponse<JobMatchDto> recommendedJobs = candidateJobDiscoveryService
                .getRecommendedJobs(authentication.getName(), pageable);
        
        return ResponseEntity.ok(ApiResponse.success(recommendedJobs));
    }

    @GetMapping("/job-match/{jobId}")
    @Operation(summary = "Get detailed match information for a specific job",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<JobMatchDto>> getJobMatch(
            @PathVariable UUID jobId,
            Authentication authentication) {
        
        JobMatchDto jobMatch = candidateJobDiscoveryService
                .getJobMatch(authentication.getName(), jobId);
        
        return ResponseEntity.ok(ApiResponse.success(jobMatch));
    }

    @GetMapping("/top-matches")
    @Operation(summary = "Get top job matches for candidate",
               description = "Returns the highest matching jobs for quick discovery",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<List<JobMatchDto>>> getTopMatches(
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        
        List<JobMatchDto> topMatches = candidateJobDiscoveryService
                .getTopMatches(authentication.getName(), limit);
        
        return ResponseEntity.ok(ApiResponse.success(topMatches));
    }

    @GetMapping("/matching-jobs-count")
    @Operation(summary = "Get count of matching jobs",
               description = "Returns the total number of jobs that match the candidate's profile",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Long>> getMatchingJobsCount(Authentication authentication) {
        
        long count = candidateJobDiscoveryService.getMatchingJobsCount(authentication.getName());
        
        return ResponseEntity.ok(ApiResponse.success("Matching jobs count retrieved", count));
    }
}
