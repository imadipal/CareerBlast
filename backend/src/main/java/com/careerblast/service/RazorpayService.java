package com.careerblast.service;

import com.careerblast.enums.SubscriptionPlan;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Subscription;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class RazorpayService {

    @Value("${app.razorpay.key-id}")
    private String keyId;

    @Value("${app.razorpay.key-secret}")
    private String keySecret;

    private RazorpayClient razorpayClient;

    private RazorpayClient getRazorpayClient() throws RazorpayException {
        if (razorpayClient == null) {
            razorpayClient = new RazorpayClient(keyId, keySecret);
        }
        return razorpayClient;
    }

    /**
     * Create Razorpay order for subscription payment
     */
    public JSONObject createOrder(SubscriptionPlan plan, String billingCycle, String userEmail) throws RazorpayException {
        RazorpayClient client = getRazorpayClient();
        
        Double amount = calculateAmount(plan, billingCycle);
        
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int)(amount * 100)); // Amount in paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "subscription_" + System.currentTimeMillis());
        
        JSONObject notes = new JSONObject();
        notes.put("plan", plan.getCode());
        notes.put("billing_cycle", billingCycle);
        notes.put("user_email", userEmail);
        orderRequest.put("notes", notes);

        Order order = client.orders.create(orderRequest);
        log.info("Created Razorpay order: {} for plan: {} and billing cycle: {}", order.get("id"), plan, billingCycle);
        
        return order.toJson();
    }

    /**
     * Create Razorpay subscription for recurring payments
     */
    public JSONObject createSubscription(SubscriptionPlan plan, String billingCycle, String userEmail) throws RazorpayException {
        RazorpayClient client = getRazorpayClient();
        
        // First create a plan if it doesn't exist
        String planId = createOrGetPlan(plan, billingCycle);
        
        JSONObject subscriptionRequest = new JSONObject();
        subscriptionRequest.put("plan_id", planId);
        subscriptionRequest.put("customer_notify", 1);
        subscriptionRequest.put("total_count", 12); // 12 billing cycles
        
        JSONObject notes = new JSONObject();
        notes.put("plan", plan.getCode());
        notes.put("billing_cycle", billingCycle);
        notes.put("user_email", userEmail);
        subscriptionRequest.put("notes", notes);

        Subscription subscription = client.subscriptions.create(subscriptionRequest);
        log.info("Created Razorpay subscription: {} for plan: {}", subscription.get("id"), plan);
        
        return subscription.toJson();
    }

    /**
     * Create or get existing Razorpay plan
     */
    private String createOrGetPlan(SubscriptionPlan plan, String billingCycle) throws RazorpayException {
        RazorpayClient client = getRazorpayClient();
        
        String planId = plan.getCode() + "_" + billingCycle.toLowerCase();
        Double amount = calculateAmount(plan, billingCycle);
        String period = getPeriod(billingCycle);
        Integer interval = getInterval(billingCycle);
        
        try {
            // Try to fetch existing plan
            com.razorpay.Plan existingPlan = client.plans.fetch(planId);
            return existingPlan.get("id");
        } catch (RazorpayException e) {
            // Plan doesn't exist, create new one
            JSONObject planRequest = new JSONObject();
            planRequest.put("id", planId);
            planRequest.put("period", period);
            planRequest.put("interval", interval);
            planRequest.put("item", new JSONObject()
                .put("name", plan.getDisplayName() + " - " + billingCycle)
                .put("amount", (int)(amount * 100))
                .put("currency", "INR")
                .put("description", plan.getDescription())
            );
            
            com.razorpay.Plan newPlan = client.plans.create(planRequest);
            log.info("Created new Razorpay plan: {} for subscription plan: {}", planId, plan);
            return newPlan.get("id");
        }
    }

    /**
     * Verify payment signature
     */
    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;
            String expectedSignature = calculateSignature(payload, keySecret);
            return expectedSignature.equals(signature);
        } catch (Exception e) {
            log.error("Error verifying payment signature", e);
            return false;
        }
    }

    /**
     * Verify webhook signature
     */
    public boolean verifyWebhookSignature(String payload, String signature) {
        try {
            String expectedSignature = calculateSignature(payload, keySecret);
            return expectedSignature.equals(signature);
        } catch (Exception e) {
            log.error("Error verifying webhook signature", e);
            return false;
        }
    }

    /**
     * Calculate HMAC SHA256 signature
     */
    private String calculateSignature(String payload, String secret) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    /**
     * Calculate amount based on plan and billing cycle
     */
    private Double calculateAmount(SubscriptionPlan plan, String billingCycle) {
        switch (billingCycle.toUpperCase()) {
            case "MONTHLY":
                return plan.getMonthlyPrice();
            case "QUARTERLY":
                return plan.getQuarterlyPrice();
            case "YEARLY":
                return plan.getYearlyPrice();
            default:
                return plan.getMonthlyPrice();
        }
    }

    /**
     * Get period for Razorpay plan
     */
    private String getPeriod(String billingCycle) {
        switch (billingCycle.toUpperCase()) {
            case "YEARLY":
                return "yearly";
            case "QUARTERLY":
            case "MONTHLY":
            default:
                return "monthly";
        }
    }

    /**
     * Get interval for Razorpay plan
     */
    private Integer getInterval(String billingCycle) {
        switch (billingCycle.toUpperCase()) {
            case "QUARTERLY":
                return 3;
            case "YEARLY":
            case "MONTHLY":
            default:
                return 1;
        }
    }

    /**
     * Cancel subscription
     */
    public void cancelSubscription(String subscriptionId) throws RazorpayException {
        RazorpayClient client = getRazorpayClient();
        // Cancel the Razorpay subscription
        JSONObject request = new JSONObject();
        request.put("cancel_at_cycle_end", false);
        client.subscriptions.cancel(subscriptionId, request);
        log.info("Cancelled Razorpay subscription: {}", subscriptionId);
    }

    /**
     * Get subscription details
     */
    public JSONObject getSubscriptionDetails(String subscriptionId) throws RazorpayException {
        RazorpayClient client = getRazorpayClient();
        Subscription subscription = client.subscriptions.fetch(subscriptionId);
        return subscription.toJson();
    }
}
