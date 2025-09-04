package com.careerblast.enums;

public enum SubscriptionPlan {
    FREE("FREE", "Free Plan", 0.0, 0, "Access to non-IT jobs only"),
    BASIC("BASIC", "Basic Plan", 999.0, 30, "Access to 50 IT job applications per month"),
    PROFESSIONAL("PROFESSIONAL", "Professional Plan", 2499.0, 30, "Access to 200 IT job applications per month"),
    ENTERPRISE("ENTERPRISE", "Enterprise Plan", 4999.0, 30, "Unlimited access to IT job applications");

    private final String code;
    private final String displayName;
    private final Double monthlyPrice;
    private final Integer durationDays;
    private final String description;

    SubscriptionPlan(String code, String displayName, Double monthlyPrice, Integer durationDays, String description) {
        this.code = code;
        this.displayName = displayName;
        this.monthlyPrice = monthlyPrice;
        this.durationDays = durationDays;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public Double getMonthlyPrice() {
        return monthlyPrice;
    }

    public Double getQuarterlyPrice() {
        return monthlyPrice * 3 * 0.9; // 10% discount
    }

    public Double getYearlyPrice() {
        return monthlyPrice * 12 * 0.8; // 20% discount
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public String getDescription() {
        return description;
    }

    public Integer getApplicationLimit() {
        switch (this) {
            case BASIC:
                return 50;
            case PROFESSIONAL:
                return 200;
            case ENTERPRISE:
                return -1; // Unlimited
            default:
                return 0;
        }
    }

    public boolean isITAccessAllowed() {
        return this != FREE;
    }
}
