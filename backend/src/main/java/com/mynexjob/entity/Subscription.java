package com.mynexjob.entity;

import com.mynexjob.enums.SubscriptionPlan;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "subscriptions")
@Data
@EqualsAndHashCode(callSuper = false)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Subscription extends BaseEntity {

    @Indexed
    private String userId; // Reference to User document

    private SubscriptionPlan plan;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Boolean autoRenew = false;

    private String razorpaySubscriptionId;
    private String razorpayPaymentId;
    private Double amountPaid;

    @Builder.Default
    private String currency = "INR";

    @Builder.Default
    private Integer applicationsUsed = 0;

    private String billingCycle; // MONTHLY, QUARTERLY, YEARLY

    // Helper methods
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(endDate);
    }

    public boolean isValidForITAccess() {
        return isActive && !isExpired() && plan.isITAccessAllowed();
    }

    public boolean canAccessMoreApplications() {
        if (plan == SubscriptionPlan.ENTERPRISE) {
            return true; // Unlimited
        }
        return applicationsUsed < plan.getApplicationLimit();
    }

    public void incrementApplicationUsage() {
        if (plan != SubscriptionPlan.ENTERPRISE) {
            this.applicationsUsed++;
        }
    }

    public Integer getRemainingApplications() {
        if (plan == SubscriptionPlan.ENTERPRISE) {
            return -1; // Unlimited
        }
        return Math.max(0, plan.getApplicationLimit() - applicationsUsed);
    }

    // Method for canceling subscription (used by RazorpayService)
    public void cancel() {
        this.isActive = false;
        this.autoRenew = false;
    }
}
