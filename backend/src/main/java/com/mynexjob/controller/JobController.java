package com.mynexjob.controller;

import com.mynexjob.dto.common.ApiResponse;
import com.mynexjob.dto.common.PagedResponse;
import com.mynexjob.dto.job.CreateJobRequest;
import com.mynexjob.dto.job.JobDto;
import com.mynexjob.dto.job.JobSearchRequest;
import com.mynexjob.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
@Tag(name = "Jobs", description = "Job management APIs")
public class JobController {

    private final JobService jobService;

    @GetMapping("/search")
    @Operation(summary = "Search jobs with filters")
    public ResponseEntity<ApiResponse<PagedResponse<JobDto>>> searchJobs(
            @ModelAttribute JobSearchRequest searchRequest) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(searchRequest.getSortDirection()), 
                           searchRequest.getSortBy());
        Pageable pageable = PageRequest.of(searchRequest.getPage(), searchRequest.getSize(), sort);
        
        PagedResponse<JobDto> jobs = jobService.searchJobs(searchRequest, pageable);
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @GetMapping("/{jobId}")
    @Operation(summary = "Get job by ID")
    public ResponseEntity<ApiResponse<JobDto>> getJobById(@PathVariable String jobId) {
        JobDto job = jobService.getJobById(jobId);
        return ResponseEntity.ok(ApiResponse.success(job));
    }

    @PostMapping
    @Operation(summary = "Create a new job", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<JobDto>> createJob(
            @Valid @RequestBody CreateJobRequest request,
            Authentication authentication) {
        JobDto job = jobService.createJob(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Job created successfully", job));
    }

    @PutMapping("/{jobId}")
    @Operation(summary = "Update job", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<JobDto>> updateJob(
            @PathVariable String jobId,
            @Valid @RequestBody CreateJobRequest request,
            Authentication authentication) {
        JobDto job = jobService.updateJob(jobId, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Job updated successfully", job));
    }

    @DeleteMapping("/{jobId}")
    @Operation(summary = "Delete job", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<String>> deleteJob(
            @PathVariable String jobId,
            Authentication authentication) {
        jobService.deleteJob(jobId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Job deleted successfully", "Job has been removed"));
    }

    @GetMapping("/company/{companyId}")
    @Operation(summary = "Get jobs by company")
    public ResponseEntity<ApiResponse<PagedResponse<JobDto>>> getJobsByCompany(
            @PathVariable String companyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "postedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PagedResponse<JobDto> jobs = jobService.getJobsByCompany(companyId, pageable);
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured jobs")
    public ResponseEntity<ApiResponse<List<JobDto>>> getFeaturedJobs() {
        List<JobDto> jobs = jobService.getFeaturedJobs();
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }

    @GetMapping("/latest")
    @Operation(summary = "Get latest jobs")
    public ResponseEntity<ApiResponse<List<JobDto>>> getLatestJobs() {
        List<JobDto> jobs = jobService.getLatestJobs();
        return ResponseEntity.ok(ApiResponse.success(jobs));
    }
}
