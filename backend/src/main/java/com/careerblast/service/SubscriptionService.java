package com.careerblast.service;

import com.careerblast.entity.Subscription;
import com.careerblast.entity.User;
import com.careerblast.enums.SubscriptionPlan;
import com.careerblast.repository.SubscriptionRepository;
import com.careerblast.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    /**
     * Get active subscription for a user
     */
    public Optional<Subscription> getActiveSubscription(String userId) {
        return subscriptionRepository.findActiveSubscriptionByUser(userId, LocalDateTime.now());
    }

    /**
     * Check if user has active IT subscription
     */
    public boolean hasActiveITSubscription(String userId) {
        Optional<Subscription> subscription = getActiveSubscription(userId);
        return subscription.map(Subscription::isValidForITAccess).orElse(false);
    }

    /**
     * Check if user can access more IT job applications
     */
    public boolean canAccessITApplication(String userId) {
        Optional<Subscription> subscription = getActiveSubscription(userId);
        if (subscription.isEmpty()) {
            return false;
        }
        return subscription.get().isValidForITAccess() && subscription.get().canAccessMoreApplications();
    }

    /**
     * Increment application usage for user
     */
    public void incrementApplicationUsage(String userId) {
        Optional<Subscription> subscription = getActiveSubscription(userId);
        if (subscription.isPresent()) {
            subscription.get().incrementApplicationUsage();
            subscriptionRepository.save(subscription.get());
            log.info("Incremented application usage for user: {}", userId);
        }
    }

    /**
     * Create a new subscription
     */
    public Subscription createSubscription(String userId, SubscriptionPlan plan, String billingCycle,
                                         String razorpaySubscriptionId, String razorpayPaymentId, Double amountPaid) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Deactivate existing subscriptions
        deactivateExistingSubscriptions(user);

        // Calculate subscription duration based on billing cycle
        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = calculateEndDate(startDate, billingCycle);

        Subscription subscription = new Subscription();
        subscription.setUserId(user.getId());
        subscription.setPlan(plan);
        subscription.setStartDate(startDate);
        subscription.setEndDate(endDate);
        subscription.setIsActive(true);
        subscription.setAutoRenew(false);
        subscription.setBillingCycle(billingCycle);
        subscription.setRazorpaySubscriptionId(razorpaySubscriptionId);
        subscription.setRazorpayPaymentId(razorpayPaymentId);
        subscription.setAmountPaid(amountPaid);
        subscription.setCurrency("INR");
        subscription.setApplicationsUsed(0);

        Subscription savedSubscription = subscriptionRepository.save(subscription);
        log.info("Created subscription for user: {} with plan: {}", userId, plan);
        return savedSubscription;
    }

    /**
     * Deactivate existing subscriptions for user
     */
    private void deactivateExistingSubscriptions(User user) {
        List<Subscription> existingSubscriptions = subscriptionRepository.findByUserOrderByCreatedAtDesc(user.getId());
        for (Subscription sub : existingSubscriptions) {
            if (sub.getIsActive()) {
                sub.setIsActive(false);
                subscriptionRepository.save(sub);
            }
        }
    }

    /**
     * Calculate end date based on billing cycle
     */
    private LocalDateTime calculateEndDate(LocalDateTime startDate, String billingCycle) {
        switch (billingCycle.toUpperCase()) {
            case "MONTHLY":
                return startDate.plusMonths(1);
            case "QUARTERLY":
                return startDate.plusMonths(3);
            case "YEARLY":
                return startDate.plusYears(1);
            default:
                return startDate.plusMonths(1);
        }
    }

    /**
     * Get subscription history for user
     */
    @Transactional(readOnly = true)
    public List<Subscription> getSubscriptionHistory(String userId) {
        return subscriptionRepository.findByUserOrderByCreatedAtDesc(userId);
    }

    /**
     * Get remaining applications for user
     */
    @Transactional(readOnly = true)
    public Integer getRemainingApplications(String userId) {
        Optional<Subscription> subscription = getActiveSubscription(userId);
        return subscription.map(Subscription::getRemainingApplications).orElse(0);
    }

    /**
     * Cancel subscription
     */
    public void cancelSubscription(String userId) {
        Optional<Subscription> subscription = getActiveSubscription(userId);
        if (subscription.isPresent()) {
            subscription.get().setIsActive(false);
            subscription.get().setAutoRenew(false);
            subscriptionRepository.save(subscription.get());
            log.info("Cancelled subscription for user: {}", userId);
        }
    }

    /**
     * Find subscriptions expiring soon (for reminders)
     */
    @Transactional(readOnly = true)
    public List<Subscription> findExpiringSubscriptions(int daysAhead) {
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime end = start.plusDays(daysAhead);
        return subscriptionRepository.findExpiringSubscriptions(start, end);
    }

    /**
     * Get subscription analytics
     */
    @Transactional(readOnly = true)
    public List<Object[]> getSubscriptionAnalytics(LocalDateTime start, LocalDateTime end) {
        // For now, return empty list - this would need to be implemented with aggregation
        return List.of();
    }

    /**
     * Calculate revenue for period
     */
    @Transactional(readOnly = true)
    public Double calculateRevenue(LocalDateTime start, LocalDateTime end) {
        // For now, return 0.0 - this would need to be implemented with aggregation
        return 0.0;
    }
}
