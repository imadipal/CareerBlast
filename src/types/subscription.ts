export interface SubscriptionPlan {
  code: string;
  name: string;
  description: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  yearlyPrice: number;
  applicationLimit: number;
  features: string[];
}

export interface Subscription {
  id: string;
  plan: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
  razorpaySubscriptionId?: string;
  razorpayPaymentId?: string;
  amountPaid: number;
  currency: string;
  applicationsUsed: number;
  billingCycle: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  canAccessMoreApplications: boolean;
  remainingApplications: number;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  notes: {
    plan: string;
    billing_cycle: string;
    user_email: string;
  };
}

export interface PaymentVerification {
  orderId: string;
  paymentId: string;
  signature: string;
  plan: string;
  billingCycle: string;
  amountPaid: number;
}

export type BillingCycle = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export interface PricingCardProps {
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  isPopular?: boolean;
  onSelectPlan: (plan: string, billingCycle: BillingCycle) => void;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open(): void;
    };
  }
}
