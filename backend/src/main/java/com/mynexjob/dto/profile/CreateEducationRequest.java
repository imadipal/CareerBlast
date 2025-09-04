package com.mynexjob.dto.profile;

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
public class CreateEducationRequest {

    @NotBlank(message = "Institution is required")
    @Size(max = 255, message = "Institution must not exceed 255 characters")
    private String institution;

    @NotBlank(message = "Degree is required")
    @Size(max = 255, message = "Degree must not exceed 255 characters")
    private String degree;

    @Size(max = 255, message = "Field of study must not exceed 255 characters")
    private String fieldOfStudy;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean isCurrent = false;

    @Size(max = 50, message = "Grade must not exceed 50 characters")
    private String grade;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;
}
