package com.careerblast.repository;

import com.careerblast.entity.Subscription;
import com.careerblast.enums.SubscriptionPlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends MongoRepository<Subscription, String> {

    // Find active subscription for a user
    @Query("{ 'userId': ?0, 'isActive': true, 'endDate': { $gt: ?1 } }")
    Optional<Subscription> findActiveSubscriptionByUser(String userId, LocalDateTime now);

    // Find all subscriptions for a user
    @Query(value = "{ 'userId': ?0 }", sort = "{ 'createdAt': -1 }")
    List<Subscription> findByUserOrderByCreatedAtDesc(String userId);

    // Find subscriptions by plan
    Page<Subscription> findByPlan(SubscriptionPlan plan, Pageable pageable);

    // Find expiring subscriptions (for renewal reminders)
    @Query("{ 'isActive': true, 'endDate': { $gte: ?0, $lte: ?1 }, 'autoRenew': false }")
    List<Subscription> findExpiringSubscriptions(LocalDateTime start, LocalDateTime end);

    // Find subscriptions for auto-renewal
    @Query("{ 'isActive': true, 'endDate': { $lte: ?0 }, 'autoRenew': true }")
    List<Subscription> findSubscriptionsForAutoRenewal(LocalDateTime renewalDate);

    // Find by Razorpay subscription ID
    Optional<Subscription> findByRazorpaySubscriptionId(String razorpaySubscriptionId);

    // Find by Razorpay payment ID
    Optional<Subscription> findByRazorpayPaymentId(String razorpayPaymentId);

    // Count active subscriptions by plan
    @Query(value = "{ 'plan': ?0, 'isActive': true, 'endDate': { $gt: ?1 } }", count = true)
    Long countActiveSubscriptionsByPlan(SubscriptionPlan plan, LocalDateTime now);

    // Find user IDs with active paid subscriptions
    @Query(value = "{ 'isActive': true, 'endDate': { $gt: ?0 }, 'plan': { $ne: 'FREE' } }", fields = "{ 'userId': 1 }")
    List<String> findUsersWithActiveITSubscriptions(LocalDateTime now);

    // Note: Revenue analytics would need to be implemented using aggregation in service layer

}
