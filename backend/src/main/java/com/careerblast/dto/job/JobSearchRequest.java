package com.careerblast.dto.job;

import com.careerblast.enums.JobType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobSearchRequest {
    private String keyword;
    private String location;
    private List<JobType> jobTypes;
    private List<UUID> companyIds;
    private List<UUID> skillIds;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private Integer experienceMin;
    private Integer experienceMax;
    private Boolean isRemote;
    private Boolean isHybrid;
    private Boolean isFeatured;
    private String sortBy = "postedAt";
    private String sortDirection = "desc";
    private Integer page = 0;
    private Integer size = 20;
}
