import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Shield, ArrowLeft } from 'lucide-react';
import { subscriptionAPI } from '../services/subscriptionAPI';
import { useAuth } from '../hooks/useAuth';
import type { SubscriptionPlan, BillingCycle, PaymentOrder, RazorpayOptions } from '../types/subscription';

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
    
    // Get plan and billing cycle from navigation state
    const state = location.state as { plan?: string; billingCycle?: BillingCycle };
    if (state?.billingCycle) {
      setBillingCycle(state.billingCycle);
    }
  }, [location.state]);

  useEffect(() => {
    // Set selected plan when plans are loaded
    const state = location.state as { plan?: string; billingCycle?: BillingCycle };
    if (state?.plan && plans.length > 0) {
      const plan = plans.find(p => p.code === state.plan);
      if (plan) {
        setSelectedPlan(plan);
      }
    }
  }, [plans, location.state]);

  const loadPlans = async () => {
    try {
      const plansData = await subscriptionAPI.getPlans();
      setPlans(plansData);
    } catch (err) {
      setError('Failed to load pricing plans');
      console.error('Error loading plans:', err);
    }
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!selectedPlan || !user) {
      setError('Please select a plan and ensure you are logged in');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order
      const order: PaymentOrder = await subscriptionAPI.createOrder(selectedPlan.code, billingCycle);
      
      const options: RazorpayOptions = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
        amount: order.amount,
        currency: order.currency,
        name: 'CareerBlast',
        description: `${selectedPlan.name} - ${billingCycle} Subscription`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment
            await subscriptionAPI.verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              plan: selectedPlan.code,
              billingCycle,
              amountPaid: order.amount / 100 // Convert from paise to rupees
            });

            // Redirect to success page
            navigate('/subscription/success', {
              state: { 
                plan: selectedPlan.name,
                amount: order.amount / 100,
                billingCycle 
              }
            });
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
            console.error('Payment verification error:', err);
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        },
        theme: {
          color: '#7C3AED'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError('Failed to initiate payment. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No plan selected</p>
          <button 
            onClick={() => navigate('/pricing')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Go to Pricing
          </button>
        </div>
      </div>
    );
  }

  const price = subscriptionAPI.getPricing(selectedPlan, billingCycle);
  const savings = subscriptionAPI.getSavingsPercentage(selectedPlan, billingCycle);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/pricing')}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Subscription</h1>
          <p className="text-gray-600 mt-2">Secure payment powered by Razorpay</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium">{selectedPlan.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Billing Cycle</span>
                <span className="font-medium">{billingCycle}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Applications Included</span>
                <span className="font-medium">
                  {selectedPlan.applicationLimit === -1 ? 'Unlimited' : selectedPlan.applicationLimit}
                </span>
              </div>
              
              {savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Savings</span>
                  <span className="font-medium">{savings}% off</span>
                </div>
              )}
              
              <hr className="my-4" />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{subscriptionAPI.formatPrice(price)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">What's Included:</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                {selectedPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Secure payment with Razorpay</p>
                  <p className="text-sm text-gray-500">
                    We accept all major credit cards, debit cards, UPI, and net banking
                  </p>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Pay {subscriptionAPI.formatPrice(price)}
                  </>
                )}
              </button>

              <div className="text-center text-sm text-gray-500">
                <p>🔒 Your payment information is secure and encrypted</p>
                <p className="mt-1">Powered by Razorpay - India's most trusted payment gateway</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <div className="flex items-start">
            <Shield className="w-6 h-6 text-green-600 mr-3 mt-1" />
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Secure & Safe Payment</h3>
              <p className="text-gray-600 text-sm">
                Your payment is processed securely through Razorpay with bank-level encryption. 
                We never store your payment information on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
