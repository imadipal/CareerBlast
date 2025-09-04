package com.mynexjob.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile extends BaseEntity {

    @Indexed
    private String userId; // Reference to User document

    private String title;
    private String summary;
    private Integer experienceYears;
    private BigDecimal currentSalary;
    private BigDecimal expectedSalary;

    @Builder.Default
    private String currency = "USD";

    private LocalDate availabilityDate;

    @Builder.Default
    private Boolean isOpenToRemote = false;

    @Builder.Default
    private Boolean isOpenToRelocation = false;

    private String preferredLocations;
    private String resumeUrl;
    private String resumeFileName;
    private String coverLetterUrl;
    private String portfolioUrl;

    @Builder.Default
    private Integer profileCompletionPercentage = 0;

    @Builder.Default
    private Boolean isProfileComplete = false;

    @Builder.Default
    private Boolean matchingEnabled = false;

    // Skills (stored as list of skill IDs and names)
    @Builder.Default
    private List<String> skillIds = new ArrayList<>();

    @Indexed
    @Builder.Default
    private List<String> skills = new ArrayList<>();

    // Work Experience IDs (stored as list of work experience IDs)
    @Builder.Default
    private List<String> workExperienceIds = new ArrayList<>();

    // Education IDs (stored as list of education IDs)
    @Builder.Default
    private List<String> educationIds = new ArrayList<>();

    // Certification IDs (stored as list of certification IDs)
    @Builder.Default
    private List<String> certificationIds = new ArrayList<>();

    /**
     * Calculate profile completion percentage
     */
    public void calculateProfileCompletion() {
        int totalFields = 12; // Total number of important fields
        int completedFields = 0;

        if (title != null && !title.trim().isEmpty()) completedFields++;
        if (summary != null && !summary.trim().isEmpty()) completedFields++;
        if (experienceYears != null) completedFields++;
        if (expectedSalary != null) completedFields++;
        if (availabilityDate != null) completedFields++;
        if (resumeUrl != null && !resumeUrl.trim().isEmpty()) completedFields++;
        if (skills != null && !skills.isEmpty()) completedFields++;
        if (workExperienceIds != null && !workExperienceIds.isEmpty()) completedFields++;
        if (educationIds != null && !educationIds.isEmpty()) completedFields++;
        if (preferredLocations != null && !preferredLocations.trim().isEmpty()) completedFields++;
        if (isOpenToRemote != null) completedFields++;
        if (isOpenToRelocation != null) completedFields++;

        this.profileCompletionPercentage = (completedFields * 100) / totalFields;
        this.isProfileComplete = this.profileCompletionPercentage >= 80;
        this.matchingEnabled = this.isProfileComplete &&
                              this.experienceYears != null &&
                              this.expectedSalary != null;
    }

    /**
     * Check if profile meets minimum requirements for matching
     */
    public boolean meetsMatchingRequirements() {
        return experienceYears != null &&
               expectedSalary != null &&
               title != null && !title.trim().isEmpty() &&
               (skills != null && !skills.isEmpty());
    }

    // For MongoDB relationships - we'll need to fetch user separately
    public User getUser() {
        // This will be handled in the service layer
        return null;
    }

    // Helper methods for collections (MongoDB uses IDs, not embedded objects)
    public List<WorkExperience> getWorkExperiences() {
        // This will be handled in the service layer by fetching by IDs
        return new ArrayList<>();
    }

    public List<Education> getEducations() {
        // This will be handled in the service layer by fetching by IDs
        return new ArrayList<>();
    }

    public List<Certification> getCertifications() {
        // This will be handled in the service layer by fetching by IDs
        return new ArrayList<>();
    }
}
