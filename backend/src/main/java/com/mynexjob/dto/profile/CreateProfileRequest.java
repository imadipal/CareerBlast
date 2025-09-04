package com.mynexjob.dto.profile;

import javax.validation.constraints.*;
import org.hibernate.validator.constraints.URL;
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
public class CreateProfileRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @Size(max = 2000, message = "Summary must not exceed 2000 characters")
    private String summary;

    @NotNull(message = "Experience years is required")
    @Min(value = 0, message = "Experience years must be non-negative")
    @Max(value = 50, message = "Experience years must not exceed 50")
    private Integer experienceYears;

    @DecimalMin(value = "0.0", inclusive = false, message = "Current salary must be positive")
    private BigDecimal currentSalary;

    @NotNull(message = "Expected salary is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Expected salary must be positive")
    private BigDecimal expectedSalary;

    @Size(max = 3, message = "Currency must not exceed 3 characters")
    private String currency = "USD";

    @Future(message = "Availability date must be in the future")
    private LocalDate availabilityDate;

    private Boolean isOpenToRemote = false;
    private Boolean isOpenToRelocation = false;

    @Size(max = 1000, message = "Preferred locations must not exceed 1000 characters")
    private String preferredLocations;

    @URL(message = "Resume URL must be valid")
    private String resumeUrl;

    @URL(message = "Cover letter URL must be valid")
    private String coverLetterUrl;

    @URL(message = "Portfolio URL must be valid")
    private String portfolioUrl;

    @NotEmpty(message = "At least one skill is required")
    private List<UUID> skillIds;

    private List<CreateWorkExperienceRequest> workExperiences;
    private List<CreateEducationRequest> educations;
    private List<CreateCertificationRequest> certifications;
}
