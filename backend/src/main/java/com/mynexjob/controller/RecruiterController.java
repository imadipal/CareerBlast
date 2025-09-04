package com.mynexjob.controller;

import com.mynexjob.dto.common.ApiResponse;
import com.mynexjob.dto.common.PagedResponse;
import com.mynexjob.dto.matching.CandidateMatchDto;
import com.mynexjob.service.RecruiterCandidateDiscoveryService;
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
@RequestMapping("/recruiters")
@RequiredArgsConstructor
@Tag(name = "Recruiter Discovery", description = "Candidate discovery and matching APIs for recruiters")
@PreAuthorize("hasRole('EMPLOYER')")
public class RecruiterController {

    private final RecruiterCandidateDiscoveryService recruiterCandidateDiscoveryService;

    @GetMapping("/jobs/{jobId}/matching-candidates")
    @Operation(summary = "Get matching candidates for a job", 
               description = "Returns candidates that match job requirements with 70%+ match score",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<PagedResponse<CandidateMatchDto>>> getMatchingCandidates(
            @PathVariable UUID jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "matchPercentage") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            Authentication authentication) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PagedResponse<CandidateMatchDto> matchingCandidates = recruiterCandidateDiscoveryService
                .getMatchingCandidates(authentication.getName(), jobId, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(matchingCandidates));
    }

    @GetMapping("/jobs/{jobId}/applicants")
    @Operation(summary = "Get job applicants", 
               description = "Returns all candidates who have applied to the job",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<PagedResponse<CandidateMatchDto>>> getJobApplicants(
            @PathVariable UUID jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "appliedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            Authentication authentication) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PagedResponse<CandidateMatchDto> applicants = recruiterCandidateDiscoveryService
                .getJobApplicants(authentication.getName(), jobId, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(applicants));
    }

    @GetMapping("/jobs/{jobId}/top-candidates")
    @Operation(summary = "Get top candidates for a job",
               description = "Returns the highest matching candidates for quick review",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<List<CandidateMatchDto>>> getTopCandidates(
            @PathVariable UUID jobId,
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        
        List<CandidateMatchDto> topCandidates = recruiterCandidateDiscoveryService
                .getTopCandidatesForJob(authentication.getName(), jobId, limit);
        
        return ResponseEntity.ok(ApiResponse.success(topCandidates));
    }

    @GetMapping("/jobs/{jobId}/matching-candidates-count")
    @Operation(summary = "Get count of matching candidates",
               description = "Returns the total number of candidates that match the job requirements",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Long>> getMatchingCandidatesCount(
            @PathVariable UUID jobId,
            Authentication authentication) {
        
        long count = recruiterCandidateDiscoveryService
                .getMatchingCandidatesCount(authentication.getName(), jobId);
        
        return ResponseEntity.ok(ApiResponse.success("Matching candidates count retrieved", count));
    }
}
