package com.careerblast.service;

import com.careerblast.dto.common.PagedResponse;
import com.careerblast.dto.job.CreateJobRequest;
import com.careerblast.dto.job.JobDto;
import com.careerblast.dto.job.JobSearchRequest;
import com.careerblast.entity.Company;
import com.careerblast.entity.Job;

import com.careerblast.entity.User;
import com.careerblast.enums.JobCategory;
import com.careerblast.exception.BadRequestException;
import com.careerblast.exception.ResourceNotFoundException;
import com.careerblast.mapper.JobMapper;
import com.careerblast.repository.CompanyRepository;
import com.careerblast.repository.JobRepository;
import com.careerblast.repository.SkillRepository;
import com.careerblast.repository.UserRepository;
import com.careerblast.specification.JobSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final JobMapper jobMapper;
    private final MongoTemplate mongoTemplate;

    @Cacheable(value = "jobs", key = "#searchRequest.toString() + '_' + #pageable.toString()")
    public PagedResponse<JobDto> searchJobs(JobSearchRequest searchRequest, Pageable pageable) {
        log.info("Searching jobs with criteria: {}", searchRequest);

        Query query = JobSpecification.withCriteria(searchRequest);
        query.with(pageable);

        List<Job> jobs = mongoTemplate.find(query, Job.class);
        long total = mongoTemplate.count(query.skip(0).limit(0), Job.class);

        List<JobDto> jobDtos = jobs.stream()
                .map(jobMapper::toDto)
                .collect(java.util.stream.Collectors.toList());

        int totalPages = (int) Math.ceil((double) total / pageable.getPageSize());

        return PagedResponse.<JobDto>builder()
                .content(jobDtos)
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(total)
                .totalPages(totalPages)
                .first(pageable.getPageNumber() == 0)
                .last(pageable.getPageNumber() >= totalPages - 1)
                .hasNext(pageable.getPageNumber() < totalPages - 1)
                .hasPrevious(pageable.getPageNumber() > 0)
                .build();
    }

    public JobDto getJobById(String jobId) {
        Job job = jobRepository.findByIdAndIsActiveTrue(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));

        // Increment view count
        job.setViewsCount(job.getViewsCount() + 1);
        jobRepository.save(job);

        return jobMapper.toDto(job);
    }

    @Transactional
    @PreAuthorize("hasRole('EMPLOYER')")
    public JobDto createJob(CreateJobRequest request, String userEmail) {
        log.info("Creating new job: {} by user: {}", request.getTitle(), userEmail);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Company company = companyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Company profile not found. Please complete your company profile first."));

        // Automatically categorize job based on title
        JobCategory jobCategory = JobCategory.categorizeJob(request.getTitle());

        Job job = Job.builder()
                .companyId(company.getId())
                .title(request.getTitle())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .responsibilities(request.getResponsibilities())
                .benefits(request.getBenefits())
                .jobType(request.getJobType())
                .jobCategory(jobCategory)
                .location(request.getLocation())
                .isRemote(request.getIsRemote())
                .isHybrid(request.getIsHybrid())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .actualSalaryMin(request.getActualSalaryMin())
                .actualSalaryMax(request.getActualSalaryMax())
                .salaryNegotiable(request.getSalaryNegotiable())
                .currency(request.getCurrency())
                .experienceMin(request.getExperienceMin())
                .experienceMax(request.getExperienceMax())
                .educationLevel(request.getEducationLevel())
                .applicationDeadline(request.getApplicationDeadline())
                .isFeatured(request.getIsFeatured())
                .contactEmail(request.getContactEmail())
                .externalUrl(request.getExternalUrl())
                .postedAt(LocalDateTime.now())
                .isActive(true)
                .matchingEnabled(true)
                .autoMatchCandidates(true)
                .build();

        // Add required skills
        if (request.getRequiredSkillIds() != null && !request.getRequiredSkillIds().isEmpty()) {
            List<String> skillIds = request.getRequiredSkillIds().stream()
                    .map(String::valueOf)
                    .collect(java.util.stream.Collectors.toList());
            job.setRequiredSkills(skillIds);

            // Increment usage count for skills
            skillIds.forEach(skillId -> {
                skillRepository.findById(skillId).ifPresent(skill -> {
                    skill.incrementUsageCount();
                    skillRepository.save(skill);
                });
            });
        }

        job = jobRepository.save(job);
        log.info("Job created successfully with ID: {}", job.getId());

        return jobMapper.toDto(job);
    }

    @Transactional
    @PreAuthorize("hasRole('EMPLOYER')")
    public JobDto updateJob(String jobId, CreateJobRequest request, String userEmail) {
        log.info("Updating job: {} by user: {}", jobId, userEmail);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));

        // Check if user owns this job by checking company
        Company company = companyRepository.findById(job.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        if (!company.getUserId().equals(user.getId())) {
            throw new BadRequestException("You don't have permission to update this job");
        }

        // Update job fields
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setResponsibilities(request.getResponsibilities());
        job.setBenefits(request.getBenefits());
        job.setJobType(request.getJobType());
        job.setLocation(request.getLocation());
        job.setIsRemote(request.getIsRemote());
        job.setIsHybrid(request.getIsHybrid());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setActualSalaryMin(request.getActualSalaryMin());
        job.setActualSalaryMax(request.getActualSalaryMax());
        job.setSalaryNegotiable(request.getSalaryNegotiable());
        job.setCurrency(request.getCurrency());
        job.setExperienceMin(request.getExperienceMin());
        job.setExperienceMax(request.getExperienceMax());
        job.setEducationLevel(request.getEducationLevel());
        job.setApplicationDeadline(request.getApplicationDeadline());
        job.setContactEmail(request.getContactEmail());
        job.setExternalUrl(request.getExternalUrl());

        // Update required skills
        if (request.getRequiredSkillIds() != null) {
            List<String> skillIds = request.getRequiredSkillIds().stream()
                    .map(String::valueOf)
                    .collect(java.util.stream.Collectors.toList());
            job.setRequiredSkills(skillIds);
        }

        job = jobRepository.save(job);
        log.info("Job updated successfully with ID: {}", job.getId());

        return jobMapper.toDto(job);
    }

    @Transactional
    @PreAuthorize("hasRole('EMPLOYER')")
    public void deleteJob(String jobId, String userEmail) {
        log.info("Deleting job: {} by user: {}", jobId, userEmail);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));

        // Check if user owns this job by checking company
        Company company = companyRepository.findById(job.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        if (!company.getUserId().equals(user.getId())) {
            throw new BadRequestException("You don't have permission to delete this job");
        }

        // Soft delete
        job.setIsActive(false);
        jobRepository.save(job);

        log.info("Job deleted successfully with ID: {}", job.getId());
    }

    @Transactional(readOnly = true)
    public PagedResponse<JobDto> getJobsByCompany(String companyId, Pageable pageable) {
        Page<Job> jobPage = jobRepository.findByCompanyIdAndIsActiveTrue(companyId, pageable);

        List<JobDto> jobDtos = jobPage.getContent().stream()
                .map(jobMapper::toDto)
                .collect(java.util.stream.Collectors.toList());

        return PagedResponse.<JobDto>builder()
                .content(jobDtos)
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

    @Cacheable(value = "jobs", key = "'featured'")
    @Transactional(readOnly = true)
    public List<JobDto> getFeaturedJobs() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("postedAt").descending());
        List<Job> jobs = jobRepository.findFeaturedJobs(pageable);
        return jobs.stream().map(jobMapper::toDto).collect(java.util.stream.Collectors.toList());
    }

    @Cacheable(value = "jobs", key = "'latest'")
    @Transactional(readOnly = true)
    public List<JobDto> getLatestJobs() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("postedAt").descending());
        List<Job> jobs = jobRepository.findLatestJobs(pageable);
        return jobs.stream().map(jobMapper::toDto).collect(java.util.stream.Collectors.toList());
    }
}
