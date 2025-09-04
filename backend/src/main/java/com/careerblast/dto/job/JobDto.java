package com.careerblast.dto.job;

import com.careerblast.dto.company.CompanyDto;
import com.careerblast.dto.skill.SkillDto;
import com.careerblast.enums.JobType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDto {
    private UUID id;
    private CompanyDto company;
    private String title;
    private String description;
    private String requirements;
    private String responsibilities;
    private String benefits;
    private JobType jobType;
    private String location;
    private Boolean isRemote;
    private Boolean isHybrid;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String currency;
    private Integer experienceMin;
    private Integer experienceMax;
    private String educationLevel;
    private LocalDate applicationDeadline;
    private LocalDateTime postedAt;
    private Boolean isActive;
    private Boolean isFeatured;
    private Long viewsCount;
    private Long applicationsCount;
    private String externalUrl;
    private String contactEmail;
    private List<SkillDto> requiredSkills;
    private Boolean isSaved;
    private Boolean hasApplied;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getSalaryRange() {
        if (salaryMin != null && salaryMax != null) {
            return String.format("%s %,.0f - %,.0f", currency, salaryMin, salaryMax);
        } else if (salaryMin != null) {
            return String.format("%s %,.0f+", currency, salaryMin);
        } else if (salaryMax != null) {
            return String.format("Up to %s %,.0f", currency, salaryMax);
        }
        return "Salary not disclosed";
    }

    public String getExperienceRange() {
        if (experienceMin != null && experienceMax != null) {
            return String.format("%d - %d years", experienceMin, experienceMax);
        } else if (experienceMin != null) {
            return String.format("%d+ years", experienceMin);
        } else if (experienceMax != null) {
            return String.format("Up to %d years", experienceMax);
        }
        return "Experience not specified";
    }
}
