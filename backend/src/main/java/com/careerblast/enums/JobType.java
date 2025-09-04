package com.careerblast.enums;

public enum JobType {
    FULL_TIME("FULL_TIME", "Full Time"),
    PART_TIME("PART_TIME", "Part Time"),
    CONTRACT("CONTRACT", "Contract"),
    FREELANCE("FREELANCE", "Freelance"),
    INTERNSHIP("INTERNSHIP", "Internship"),
    TEMPORARY("TEMPORARY", "Temporary");

    private final String code;
    private final String displayName;

    JobType(String code, String displayName) {
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
