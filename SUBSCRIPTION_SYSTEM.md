# CareerBlast Subscription System

## Overview

CareerBlast implements a sophisticated subscription-based pricing model that provides **free access to non-IT jobs** while requiring **paid subscriptions for IT job candidate data access**. This system ensures sustainable revenue while maintaining accessibility for general hiring needs.

## 🎯 Key Features

### For Job Seekers (Always Free)
- ✅ **Completely free** job browsing and applications
- ✅ Access to both IT and non-IT job postings
- ✅ Profile creation and management
- ✅ Job recommendations and matching
- ✅ Application tracking

### For Employers

#### Non-IT Jobs (Free Access)
- ✅ **Free access** to candidate data for Sales, Marketing, Support, etc.
- ✅ Unlimited applications viewing
- ✅ Resume downloads
- ✅ Contact information access

#### IT Jobs (Subscription Required)
- 💳 **Paid subscription** required for candidate data access
- 🔒 Paywall for viewing IT job applications
- 📊 Usage tracking and limits
- 🎯 Premium features and analytics

## 💰 Pricing Plans

### Basic Plan - ₹999/month
- 50 IT job applications per month
- Basic candidate filtering
- Email support
- Standard job posting

### Professional Plan - ₹2,499/month (Most Popular)
- 200 IT job applications per month
- Advanced candidate filtering
- Priority email support
- Featured job posting
- Analytics dashboard

### Enterprise Plan - ₹4,999/month
- Unlimited IT job applications
- Advanced AI matching
- Dedicated account manager
- Premium job posting
- Advanced analytics & reporting
- API access

### Billing Options
- **Monthly**: Full price
- **Quarterly**: 10% discount
- **Yearly**: 20% discount

## 🏗️ Technical Architecture

### Backend Components

#### Entities
- `Subscription` - Manages subscription records
- `SubscriptionPlan` - Enum defining plan types and limits
- `JobCategory` - Automatic IT/Non-IT job categorization

#### Services
- `SubscriptionService` - Core subscription management
- `RazorpayService` - Payment processing integration
- `JobAccessControlService` - Access control enforcement

#### Controllers
- `SubscriptionController` - REST API endpoints
- Webhook handling for payment verification

### Frontend Components

#### Pages
- `PricingPage` - Subscription plan selection
- `PaymentPage` - Razorpay payment integration
- `SubscriptionSuccessPage` - Post-payment confirmation
- `SubscriptionManagePage` - Subscription management

#### Components
- `PricingCard` - Individual plan display
- `SubscriptionStatusBanner` - Access restriction notifications
- `RestrictedContent` - Paywall content display

## 🔧 Implementation Details

### Job Categorization
Jobs are automatically categorized as IT or Non-IT based on title keywords:

```java
// IT Keywords
"software", "developer", "engineer", "programmer", "react", "python", 
"data scientist", "ml engineer", "devops", "cloud", "cybersecurity", etc.
```

### Access Control Logic
```java
// For IT jobs
if (job.getJobCategory() == JobCategory.IT) {
    // Check subscription
    boolean hasSubscription = subscriptionService.hasActiveITSubscription(employerId);
    boolean canAccessMore = subscriptionService.canAccessITApplication(employerId);
    
    if (hasSubscription && canAccessMore) {
        // Grant access and increment usage
        subscriptionService.incrementApplicationUsage(employerId);
        return true;
    }
    return false; // Restrict access
}

// Non-IT jobs are always free
return true;
```

### Payment Flow
1. **Plan Selection** → User selects plan and billing cycle
2. **Order Creation** → Backend creates Razorpay order
3. **Payment Processing** → Razorpay handles secure payment
4. **Verification** → Backend verifies payment signature
5. **Subscription Creation** → Active subscription is created
6. **Access Granted** → User can access IT job data

## 🔐 Security Features

### Payment Security
- **Razorpay Integration** - Bank-level encryption
- **Signature Verification** - Prevents payment tampering
- **Webhook Validation** - Secure event processing

### Access Control
- **Role-based Access** - Employer-only subscription features
- **Usage Tracking** - Prevents quota abuse
- **Real-time Validation** - Live subscription status checks

## 📊 Analytics & Monitoring

### Subscription Metrics
- Active subscriptions by plan
- Revenue tracking
- Usage analytics
- Conversion rates

### User Experience
- Subscription status dashboard
- Usage remaining indicators
- Upgrade prompts and notifications

## 🚀 Setup Instructions

### Backend Configuration

1. **Add Razorpay Credentials**
```yaml
app:
  razorpay:
    key-id: ${RAZORPAY_KEY_ID:your_key_id}
    key-secret: ${RAZORPAY_KEY_SECRET:your_key_secret}
    webhook-secret: ${RAZORPAY_WEBHOOK_SECRET:your_webhook_secret}
```

2. **Database Migration**
```sql
-- Subscription tables are auto-created via JPA
-- Job category field added to jobs table
```

### Frontend Configuration

1. **Environment Variables**
```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

2. **Razorpay Script**
```html
<!-- Automatically loaded in PaymentPage component -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

## 🧪 Testing

### Test Scenarios
1. **Free Access** - Non-IT job applications work without subscription
2. **Subscription Required** - IT jobs show paywall for non-subscribers
3. **Payment Flow** - Complete subscription purchase process
4. **Usage Limits** - Quota enforcement and upgrade prompts
5. **Access Control** - Proper restriction of candidate data

### Test Data
- Create test employers and candidates
- Post both IT and non-IT jobs
- Test subscription purchase flow
- Verify access restrictions

## 🔄 Future Enhancements

### Planned Features
- **Auto-renewal** - Automatic subscription renewals
- **Proration** - Mid-cycle plan changes
- **Team Plans** - Multi-user subscriptions
- **API Access** - Programmatic job posting
- **Advanced Analytics** - Detailed hiring insights

### Scalability
- **Caching** - Redis for subscription status
- **Rate Limiting** - API usage controls
- **Load Balancing** - Multi-instance deployment

## 📞 Support

### For Developers
- Check logs for payment/subscription errors
- Monitor webhook delivery status
- Verify Razorpay dashboard for payment issues

### For Users
- Subscription management page for self-service
- Email support for billing issues
- Clear upgrade paths and pricing information

---

This subscription system provides a robust, scalable foundation for monetizing IT job access while maintaining free access to general hiring needs.
