package com.mynexjob.enums;

import java.util.Arrays;
import java.util.List;

public enum JobCategory {
    IT("IT", "Information Technology"),
    NON_IT("NON_IT", "Non-Information Technology");

    private final String code;
    private final String displayName;

    JobCategory(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    // IT job titles that require subscription
    private static final List<String> IT_JOB_KEYWORDS = Arrays.asList(
        "software", "developer", "engineer", "programmer", "architect", "devops",
        "frontend", "backend", "fullstack", "full stack", "full-stack",
        "react", "angular", "vue", "node", "java", "python", "javascript",
        "typescript", "php", "ruby", "golang", "kotlin", "swift",
        "mobile", "android", "ios", "flutter", "react native",
        "data scientist", "data engineer", "ml engineer", "ai engineer",
        "machine learning", "artificial intelligence", "deep learning",
        "cloud", "aws", "azure", "gcp", "kubernetes", "docker",
        "cybersecurity", "security engineer", "penetration tester",
        "database", "dba", "sql", "nosql", "mongodb", "postgresql",
        "ui/ux", "ui designer", "ux designer", "product designer",
        "qa", "quality assurance", "test engineer", "automation",
        "scrum master", "product manager", "technical", "tech lead",
        "system admin", "network", "infrastructure", "it support"
    );

    public static JobCategory categorizeJob(String jobTitle) {
        if (jobTitle == null) {
            return NON_IT;
        }
        
        String lowerTitle = jobTitle.toLowerCase();
        boolean isIT = IT_JOB_KEYWORDS.stream()
            .anyMatch(keyword -> lowerTitle.contains(keyword.toLowerCase()));
        
        return isIT ? IT : NON_IT;
    }

    public boolean requiresSubscription() {
        return this == IT;
    }
}
