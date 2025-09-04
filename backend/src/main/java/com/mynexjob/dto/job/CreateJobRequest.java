package com.mynexjob.dto.job;

import com.mynexjob.enums.JobType;
import javax.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateJobRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String requirements;
    private String responsibilities;
    private String benefits;

    @NotNull(message = "Job type is required")
    private JobType jobType;

    @NotBlank(message = "Location is required")
    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    private Boolean isRemote = false;
    private Boolean isHybrid = false;

    // Public salary range (visible to candidates)
    @DecimalMin(value = "0.0", inclusive = false, message = "Minimum salary must be positive")
    private BigDecimal salaryMin;

    @DecimalMin(value = "0.0", inclusive = false, message = "Maximum salary must be positive")
    private BigDecimal salaryMax;

    // Actual salary range (private, for matching purposes)
    @DecimalMin(value = "0.0", inclusive = false, message = "Actual minimum salary must be positive")
    private BigDecimal actualSalaryMin;

    @DecimalMin(value = "0.0", inclusive = false, message = "Actual maximum salary must be positive")
    private BigDecimal actualSalaryMax;

    private Boolean salaryNegotiable = false;

    @Size(max = 3, message = "Currency must not exceed 3 characters")
    private String currency = "USD";

    @Min(value = 0, message = "Minimum experience must be non-negative")
    private Integer experienceMin;

    @Min(value = 0, message = "Maximum experience must be non-negative")
    private Integer experienceMax;

    @Size(max = 100, message = "Education level must not exceed 100 characters")
    private String educationLevel;

    @Future(message = "Application deadline must be in the future")
    private LocalDate applicationDeadline;

    private Boolean isFeatured = false;

    @Email(message = "Contact email should be valid")
    private String contactEmail;

    private String externalUrl;

    private List<UUID> requiredSkillIds;
}
