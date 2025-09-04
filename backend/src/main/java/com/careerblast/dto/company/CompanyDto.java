package com.careerblast.dto.company;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyDto {
    private UUID id;
    private String name;
    private String description;
    private String industry;
    private String companySize;
    private Integer foundedYear;
    private String headquarters;
    private String websiteUrl;
    private String logoUrl;
    private String coverImageUrl;
    private String linkedinUrl;
    private String twitterUrl;
    private String facebookUrl;
    private Boolean isVerified;
    private Boolean isFeatured;
    private Integer employeeCount;
    private String cultureDescription;
    private String benefitsDescription;
    private Long jobsCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
