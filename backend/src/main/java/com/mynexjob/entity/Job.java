package com.mynexjob.entity;

import com.mynexjob.enums.JobType;
import com.mynexjob.enums.JobCategory;
import lombok.*;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "jobs")
@CompoundIndex(name = "active_company_idx", def = "{'isActive': 1, 'companyId': 1, 'createdAt': -1}")
@CompoundIndex(name = "search_idx", def = "{'isActive': 1, 'jobCategory': 1, 'location': 1}")
@CompoundIndex(name = "salary_idx", def = "{'isActive': 1, 'salaryMin': 1, 'salaryMax': 1}")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job extends BaseEntity {

    private String companyId; // Reference to Company document

    @Indexed
    private String title;

    private String description;
    private String requirements;
    private String responsibilities;
    private String benefits;

    private JobType jobType;

    @Builder.Default
    private JobCategory jobCategory = JobCategory.NON_IT;

    @Indexed
    private String location;

    @Builder.Default
    private Boolean isRemote = false;

    @Builder.Default
    private Boolean isHybrid = false;

    // Public salary range (visible to candidates)
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;

    // Private salary information (visible only to recruiters)
    private BigDecimal actualSalaryMin;
    private BigDecimal actualSalaryMax;

    @Builder.Default
    private Boolean salaryNegotiable = false;

    @Builder.Default
    private String currency = "USD";

    private Integer experienceMin;

    private Integer experienceMax;
    private String educationLevel;
    private LocalDate applicationDeadline;

    @Builder.Default
    private LocalDateTime postedAt = LocalDateTime.now();

    @Indexed
    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Boolean isFeatured = false;

    @Builder.Default
    private Long viewsCount = 0L;

    @Builder.Default
    private Long applicationsCount = 0L;

    private String externalUrl;
    private String contactEmail;

    @Builder.Default
    private Boolean matchingEnabled = true;

    @Builder.Default
    private Boolean autoMatchCandidates = true;

    // Skills required for this job (stored as list of skill IDs)
    @Builder.Default
    private List<String> requiredSkillIds = new ArrayList<>();

    // Skills as strings for easy searching
    @Indexed
    @Builder.Default
    private List<String> skills = new ArrayList<>();

    public void incrementViewsCount() {
        this.viewsCount++;
    }

    public void incrementApplicationsCount() {
        this.applicationsCount++;
    }

    // Helper methods for compatibility with service layer
    public void setRequiredSkills(List<String> requiredSkills) {
        this.requiredSkillIds = requiredSkills != null ? requiredSkills : new ArrayList<>();
        this.skills = requiredSkills != null ? requiredSkills : new ArrayList<>();
    }

    public List<String> getRequiredSkills() {
        return requiredSkillIds != null ? requiredSkillIds : new ArrayList<>();
    }

    // For MongoDB relationships - we'll need to fetch company separately
    public Company getCompany() {
        // This will be handled in the service layer
        return null;
    }
}
