import { api } from './api';
import type { 
  SubscriptionPlan, 
  Subscription, 
  SubscriptionStatus, 
  PaymentOrder, 
  PaymentVerification,
  BillingCycle 
} from '../types/subscription';

export const subscriptionAPI = {
  // Get all subscription plans
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await api.get('/subscriptions/plans');
    return response.data.data;
  },

  // Get current subscription
  getCurrentSubscription: async (): Promise<Subscription | null> => {
    const response = await api.get('/subscriptions/current');
    return response.data.data;
  },

  // Get subscription history
  getSubscriptionHistory: async (): Promise<Subscription[]> => {
    const response = await api.get('/subscriptions/history');
    return response.data.data;
  },

  // Get subscription status
  getSubscriptionStatus: async (): Promise<SubscriptionStatus> => {
    const response = await api.get('/subscriptions/status');
    return response.data.data;
  },

  // Create payment order
  createOrder: async (plan: string, billingCycle: BillingCycle): Promise<PaymentOrder> => {
    const response = await api.post('/subscriptions/create-order', {
      plan,
      billingCycle
    });
    return response.data.data;
  },

  // Verify payment and create subscription
  verifyPayment: async (paymentData: PaymentVerification): Promise<Subscription> => {
    const response = await api.post('/subscriptions/verify-payment', paymentData);
    return response.data.data;
  },

  // Cancel subscription
  cancelSubscription: async (): Promise<void> => {
    await api.post('/subscriptions/cancel');
  },

  // Check if user can access IT job applications
  canAccessITApplication: async (): Promise<boolean> => {
    try {
      const status = await subscriptionAPI.getSubscriptionStatus();
      return status.hasActiveSubscription && status.canAccessMoreApplications;
    } catch (error) {
      console.error('Error checking IT access:', error);
      return false;
    }
  },

  // Get pricing for a plan and billing cycle
  getPricing: (plan: SubscriptionPlan, billingCycle: BillingCycle): number => {
    switch (billingCycle) {
      case 'MONTHLY':
        return plan.monthlyPrice;
      case 'QUARTERLY':
        return plan.quarterlyPrice;
      case 'YEARLY':
        return plan.yearlyPrice;
      default:
        return plan.monthlyPrice;
    }
  },

  // Calculate savings percentage
  getSavingsPercentage: (plan: SubscriptionPlan, billingCycle: BillingCycle): number => {
    const monthlyTotal = plan.monthlyPrice * (billingCycle === 'QUARTERLY' ? 3 : 12);
    const actualPrice = subscriptionAPI.getPricing(plan, billingCycle);
    
    if (billingCycle === 'MONTHLY') return 0;
    
    return Math.round(((monthlyTotal - actualPrice) / monthlyTotal) * 100);
  },

  // Format price for display
  formatPrice: (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  // Get billing cycle display text
  getBillingCycleText: (billingCycle: BillingCycle): string => {
    switch (billingCycle) {
      case 'MONTHLY':
        return 'per month';
      case 'QUARTERLY':
        return 'per quarter';
      case 'YEARLY':
        return 'per year';
      default:
        return 'per month';
    }
  },

  // Check if plan is recommended
  isRecommendedPlan: (planCode: string): boolean => {
    return planCode === 'PROFESSIONAL';
  },

  // Get plan color theme
  getPlanColor: (planCode: string): string => {
    switch (planCode) {
      case 'BASIC':
        return 'blue';
      case 'PROFESSIONAL':
        return 'purple';
      case 'ENTERPRISE':
        return 'gold';
      default:
        return 'gray';
    }
  }
};
