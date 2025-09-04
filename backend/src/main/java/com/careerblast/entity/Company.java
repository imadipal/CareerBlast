package com.careerblast.entity;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company extends BaseEntity {

    private String userId; // Reference to User document

    @Indexed
    private String name;

    private String description;

    @Indexed
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

    @Builder.Default
    private Boolean isVerified = false;

    @Builder.Default
    private Boolean isFeatured = false;

    private Integer employeeCount;
    private String cultureDescription;
    private String benefitsDescription;

    // Job IDs posted by this company (stored as list of job IDs)
    @Builder.Default
    private List<String> jobIds = new ArrayList<>();

    // Company location IDs (stored as list of location IDs)
    @Builder.Default
    private List<String> locationIds = new ArrayList<>();

    // For MongoDB relationships - we'll need to fetch user and jobs separately
    public User getUser() {
        // This will be handled in the service layer
        return null;
    }

    public List<Job> getJobs() {
        // This will be handled in the service layer by fetching by companyId
        return new ArrayList<>();
    }

    public void incrementJobsCount() {
        // For now, we'll handle this in the service layer
    }

    public void decrementJobsCount() {
        // For now, we'll handle this in the service layer
    }

    // Helper method for jobs count (calculated from jobIds list)
    public long getJobsCount() {
        return jobIds != null ? jobIds.size() : 0;
    }
}
