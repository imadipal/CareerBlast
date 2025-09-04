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
public class RecruiterJobDto {
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
    
    // Public salary range (visible to candidates)
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    
    // Private salary information (visible only to recruiters)
    private BigDecimal actualSalaryMin;
    private BigDecimal actualSalaryMax;
    private Boolean salaryNegotiable;
    
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
    private Boolean matchingEnabled;
    private Boolean autoMatchCandidates;
    private List<SkillDto> requiredSkills;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getActualSalaryRange() {
        if (actualSalaryMin != null && actualSalaryMax != null) {
            return String.format("%s %,.0f - %,.0f", currency, actualSalaryMin, actualSalaryMax);
        } else if (actualSalaryMin != null) {
            return String.format("%s %,.0f+", currency, actualSalaryMin);
        } else if (actualSalaryMax != null) {
            return String.format("Up to %s %,.0f", currency, actualSalaryMax);
        }
        return "Salary not disclosed";
    }

    public String getPublicSalaryRange() {
        if (salaryMin != null && salaryMax != null) {
            return String.format("%s %,.0f - %,.0f", currency, salaryMin, salaryMax);
        } else if (salaryMin != null) {
            return String.format("%s %,.0f+", currency, salaryMin);
        } else if (salaryMax != null) {
            return String.format("Up to %s %,.0f", currency, salaryMax);
        }
        return "Salary not disclosed";
    }
}
