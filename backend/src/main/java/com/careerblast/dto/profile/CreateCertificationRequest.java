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
public class CreateCertificationRequest {

    @NotBlank(message = "Certification name is required")
    @Size(max = 255, message = "Name must not exceed 255 characters")
    private String name;

    @NotBlank(message = "Issuing organization is required")
    @Size(max = 255, message = "Issuing organization must not exceed 255 characters")
    private String issuingOrganization;

    @NotNull(message = "Issue date is required")
    private LocalDate issueDate;

    private LocalDate expiryDate;

    @Size(max = 255, message = "Credential ID must not exceed 255 characters")
    private String credentialId;

    private String credentialUrl;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    private Boolean doesNotExpire = false;
}
