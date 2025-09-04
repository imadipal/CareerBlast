package com.mynexjob.enums;

public enum ApplicationStatus {
    PENDING("PENDING", "Pending Review"),
    REVIEWING("REVIEWING", "Under Review"),
    SHORTLISTED("SHORTLISTED", "Shortlisted"),
    INTERVIEW_SCHEDULED("INTERVIEW_SCHEDULED", "Interview Scheduled"),
    INTERVIEWED("INTERVIEWED", "Interviewed"),
    OFFERED("OFFERED", "Offer Extended"),
    ACCEPTED("ACCEPTED", "Offer Accepted"),
    REJECTED("REJECTED", "Rejected"),
    WITHDRAWN("WITHDRAWN", "Withdrawn");

    private final String code;
    private final String displayName;

    ApplicationStatus(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }
}
