package com.mynexjob.entity;

import com.mynexjob.enums.ApplicationStatus;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;

import java.time.LocalDateTime;

@Document(collection = "job_applications")
@CompoundIndex(def = "{'userId': 1, 'jobId': 1}", unique = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication extends BaseEntity {

    @Indexed
    private String userId; // Reference to User document

    @Indexed
    private String jobId; // Reference to Job document

    @Indexed
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.PENDING;

    private String coverLetter;
    private String resumeUrl;
    private String additionalDocumentsUrls;

    @Indexed
    @Builder.Default
    private LocalDateTime appliedAt = LocalDateTime.now();

    private LocalDateTime reviewedAt;
    private LocalDateTime interviewScheduledAt;
    private String interviewNotes;
    private String feedback;
    private String rejectionReason;
    private String offerDetails;
    private String notes;

    public boolean canWithdraw() {
        return status == ApplicationStatus.PENDING || 
               status == ApplicationStatus.REVIEWING || 
               status == ApplicationStatus.SHORTLISTED;
    }

    public boolean canUpdateStatus() {
        return status != ApplicationStatus.WITHDRAWN &&
               status != ApplicationStatus.ACCEPTED;
    }

    // For MongoDB relationships - we'll need to fetch user and job separately
    public User getUser() {
        // This will be handled in the service layer
        return null;
    }

    public Job getJob() {
        // This will be handled in the service layer
        return null;
    }

    public boolean isWithdrawn() {
        return status == ApplicationStatus.WITHDRAWN;
    }
}
