package com.mynexjob.dto.profile;

import com.mynexjob.dto.skill.SkillDto;
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
public class UserProfileDto {
    private UUID id;
    private String title;
    private String summary;
    private Integer experienceYears;
    private BigDecimal currentSalary;
    private BigDecimal expectedSalary;
    private String currency;
    private LocalDate availabilityDate;
    private Boolean isOpenToRemote;
    private Boolean isOpenToRelocation;
    private String preferredLocations;
    private String resumeUrl;
    private String coverLetterUrl;
    private String portfolioUrl;
    private Integer profileCompletionPercentage;
    private Boolean isProfileComplete;
    private Boolean matchingEnabled;
    
    private List<SkillDto> skills;
    private List<WorkExperienceDto> workExperiences;
    private List<EducationDto> educations;
    private List<CertificationDto> certifications;
}
