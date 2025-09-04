package com.careerblast.dto.profile;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateWorkExperienceRequest {

    @NotBlank(message = "Company name is required")
    @Size(max = 255, message = "Company name must not exceed 255 characters")
    private String companyName;

    @NotBlank(message = "Position is required")
    @Size(max = 255, message = "Position must not exceed 255 characters")
    private String position;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean isCurrent = false;

    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    private String companyUrl;

    @Size(max = 2000, message = "Achievements must not exceed 2000 characters")
    private String achievements;
}
