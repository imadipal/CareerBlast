package com.mynexjob.controller;

import com.mynexjob.dto.ApiResponse;
import com.mynexjob.entity.Subscription;
import com.mynexjob.entity.User;
import com.mynexjob.enums.SubscriptionPlan;
import com.mynexjob.service.RazorpayService;
import com.mynexjob.service.SubscriptionService;
import com.mynexjob.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Subscription Management", description = "APIs for managing IT job subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final RazorpayService razorpayService;
    private final UserService userService;

    @GetMapping("/plans")
    @Operation(summary = "Get all subscription plans", description = "Returns all available subscription plans with pricing")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getSubscriptionPlans() {
        List<Map<String, Object>> plans = List.of(
            createPlanMap(SubscriptionPlan.BASIC),
            createPlanMap(SubscriptionPlan.PROFESSIONAL),
            createPlanMap(SubscriptionPlan.ENTERPRISE)
        );
        return ResponseEntity.ok(ApiResponse.success(plans));
    }

    @GetMapping("/current")
    @Operation(summary = "Get current subscription", 
               description = "Returns the current active subscription for the authenticated user",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Subscription>> getCurrentSubscription(Authentication authentication) {
        String userId = userService.getCurrentUserId(authentication);
        Optional<Subscription> subscription = subscriptionService.getActiveSubscription(userId);
        
        if (subscription.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success(subscription.get()));
        } else {
            return ResponseEntity.ok(ApiResponse.success(null, "No active subscription found"));
        }
    }

    @GetMapping("/history")
    @Operation(summary = "Get subscription history", 
               description = "Returns subscription history for the authenticated user",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<List<Subscription>>> getSubscriptionHistory(Authentication authentication) {
        String userId = userService.getCurrentUserId(authentication);
        List<Subscription> history = subscriptionService.getSubscriptionHistory(userId);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/status")
    @Operation(summary = "Get subscription status", 
               description = "Returns subscription status and remaining applications",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSubscriptionStatus(Authentication authentication) {
        String userId = userService.getCurrentUserId(authentication);

        boolean hasActiveSubscription = subscriptionService.hasActiveITSubscription(userId);
        boolean canAccessMore = subscriptionService.canAccessITApplication(userId);
        Integer remainingApplications = subscriptionService.getRemainingApplications(userId);
        
        Map<String, Object> status = Map.of(
            "hasActiveSubscription", hasActiveSubscription,
            "canAccessMoreApplications", canAccessMore,
            "remainingApplications", remainingApplications
        );
        
        return ResponseEntity.ok(ApiResponse.success(status));
    }

    @PostMapping("/create-order")
    @Operation(summary = "Create payment order", 
               description = "Creates a Razorpay order for subscription payment",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<JSONObject>> createOrder(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            User user = userService.getCurrentUser(authentication);
            SubscriptionPlan plan = SubscriptionPlan.valueOf(request.get("plan"));
            String billingCycle = request.get("billingCycle");
            
            JSONObject order = razorpayService.createOrder(plan, billingCycle, user.getEmail());
            return ResponseEntity.ok(ApiResponse.success(order));
        } catch (Exception e) {
            log.error("Error creating payment order", e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to create payment order: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-payment")
    @Operation(summary = "Verify payment and create subscription", 
               description = "Verifies Razorpay payment and creates subscription",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Subscription>> verifyPayment(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            String userId = userService.getCurrentUserId(authentication);
            
            String orderId = request.get("orderId");
            String paymentId = request.get("paymentId");
            String signature = request.get("signature");
            String plan = request.get("plan");
            String billingCycle = request.get("billingCycle");
            Double amountPaid = Double.parseDouble(request.get("amountPaid"));
            
            // Verify payment signature
            boolean isValid = razorpayService.verifyPaymentSignature(orderId, paymentId, signature);
            if (!isValid) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid payment signature"));
            }
            
            // Create subscription
            Subscription subscription = subscriptionService.createSubscription(
                userId, 
                SubscriptionPlan.valueOf(plan), 
                billingCycle, 
                null, // No subscription ID for one-time payment
                paymentId, 
                amountPaid
            );
            
            return ResponseEntity.ok(ApiResponse.success(subscription, "Subscription created successfully"));
        } catch (Exception e) {
            log.error("Error verifying payment", e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to verify payment: " + e.getMessage()));
        }
    }

    @PostMapping("/cancel")
    @Operation(summary = "Cancel subscription", 
               description = "Cancels the current active subscription",
               security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<String>> cancelSubscription(Authentication authentication) {
        try {
            String userId = userService.getCurrentUserId(authentication);
            subscriptionService.cancelSubscription(userId);
            return ResponseEntity.ok(ApiResponse.success("Subscription cancelled successfully"));
        } catch (Exception e) {
            log.error("Error cancelling subscription", e);
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to cancel subscription: " + e.getMessage()));
        }
    }

    @PostMapping("/webhook")
    @Operation(summary = "Razorpay webhook", description = "Handles Razorpay webhook events")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {
        try {
            boolean isValid = razorpayService.verifyWebhookSignature(payload, signature);
            if (!isValid) {
                return ResponseEntity.badRequest().body("Invalid signature");
            }
            
            JSONObject event = new JSONObject(payload);
            String eventType = event.getString("event");
            
            log.info("Received Razorpay webhook: {}", eventType);
            
            // Handle different webhook events
            switch (eventType) {
                case "payment.captured":
                    handlePaymentCaptured(event);
                    break;
                case "subscription.charged":
                    handleSubscriptionCharged(event);
                    break;
                case "subscription.cancelled":
                    handleSubscriptionCancelled(event);
                    break;
                default:
                    log.info("Unhandled webhook event: {}", eventType);
            }
            
            return ResponseEntity.ok("Webhook processed successfully");
        } catch (Exception e) {
            log.error("Error processing webhook", e);
            return ResponseEntity.badRequest().body("Error processing webhook");
        }
    }

    private Map<String, Object> createPlanMap(SubscriptionPlan plan) {
        return Map.of(
            "code", plan.getCode(),
            "name", plan.getDisplayName(),
            "description", plan.getDescription(),
            "monthlyPrice", plan.getMonthlyPrice(),
            "quarterlyPrice", plan.getQuarterlyPrice(),
            "yearlyPrice", plan.getYearlyPrice(),
            "applicationLimit", plan.getApplicationLimit(),
            "features", getPlanFeatures(plan)
        );
    }

    private List<String> getPlanFeatures(SubscriptionPlan plan) {
        switch (plan) {
            case BASIC:
                return List.of(
                    "Access to 50 IT job applications per month",
                    "Basic candidate filtering",
                    "Email support",
                    "Standard job posting"
                );
            case PROFESSIONAL:
                return List.of(
                    "Access to 200 IT job applications per month",
                    "Advanced candidate filtering",
                    "Priority email support",
                    "Featured job posting",
                    "Analytics dashboard"
                );
            case ENTERPRISE:
                return List.of(
                    "Unlimited IT job applications",
                    "Advanced candidate filtering & AI matching",
                    "Dedicated account manager",
                    "Premium job posting",
                    "Advanced analytics & reporting",
                    "API access",
                    "Custom integrations"
                );
            default:
                return List.of();
        }
    }

    private void handlePaymentCaptured(JSONObject event) {
        // Handle payment captured event
        log.info("Payment captured: {}", event);
    }

    private void handleSubscriptionCharged(JSONObject event) {
        // Handle subscription charged event
        log.info("Subscription charged: {}", event);
    }

    private void handleSubscriptionCancelled(JSONObject event) {
        // Handle subscription cancelled event
        log.info("Subscription cancelled: {}", event);
    }
}
