package com.careerblast.enums;

public enum UserRole {
    USER("USER", "Job Seeker"),
    EMPLOYER("EMPLOYER", "Employer"),
    ADMIN("ADMIN", "Administrator");

    private final String code;
    private final String displayName;

    UserRole(String code, String displayName) {
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
