import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Shield, Crown } from 'lucide-react';
import PricingCard from '../components/subscription/PricingCard';
import { subscriptionAPI } from '../services/subscriptionAPI';
import { useAuth } from '../hooks/useAuth';
import type { SubscriptionPlan, BillingCycle } from '../types/subscription';

const PricingPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const plansData = await subscriptionAPI.getPlans();
      setPlans(plansData);
    } catch (err) {
      setError('Failed to load pricing plans');
      console.error('Error loading plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planCode: string, selectedBillingCycle: BillingCycle) => {
    if (!user) {
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }

    if (user.role !== 'employer') {
      alert('Subscription plans are only available for employers.');
      return;
    }

    if (planCode === 'ENTERPRISE') {
      // Redirect to contact page for enterprise
      window.location.href = 'mailto:sales@careerblast.com?subject=Enterprise Plan Inquiry';
      return;
    }

    // Navigate to payment page
    navigate('/subscription/payment', {
      state: { plan: planCode, billingCycle: selectedBillingCycle }
    });
  };

  const billingOptions = [
    { value: 'MONTHLY' as BillingCycle, label: 'Monthly' },
    { value: 'QUARTERLY' as BillingCycle, label: 'Quarterly', badge: 'Save 10%' },
    { value: 'YEARLY' as BillingCycle, label: 'Yearly', badge: 'Save 20%' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadPlans}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access premium IT talent with our subscription plans. 
              Non-IT jobs remain completely free for all employers.
            </p>
          </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-md">
            {billingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setBillingCycle(option.value)}
                className={`relative px-6 py-3 rounded-md font-medium transition-all ${
                  billingCycle === option.value
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {option.label}
                {option.badge && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {option.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan) => (
            <PricingCard
              key={plan.code}
              plan={plan}
              billingCycle={billingCycle}
              isPopular={subscriptionAPI.isRecommendedPlan(plan.code)}
              onSelectPlan={handleSelectPlan}
            />
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose Our IT Subscription?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium IT Talent</h3>
              <p className="text-gray-600">
                Access to verified IT professionals with skills in latest technologies
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assurance</h3>
              <p className="text-gray-600">
                Pre-screened candidates with verified skills and experience
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Priority Support</h3>
              <p className="text-gray-600">
                Dedicated support and advanced matching algorithms
              </p>
            </div>
          </div>
        </div>

        {/* Free Access Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Non-IT Jobs Remain Free!
          </h3>
          <p className="text-green-700">
            Looking for Sales, Marketing, Support, or other non-technical roles? 
            Access candidate data completely free - no subscription required.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Why do IT jobs require a subscription?
              </h3>
              <p className="text-gray-600">
                IT professionals are in high demand and require specialized screening. 
                Our subscription model ensures quality candidates and sustainable platform growth.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access 
                until the end of your current billing period.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I exceed my application limit?
              </h3>
              <p className="text-gray-600">
                You can upgrade your plan anytime to get more applications. 
                Enterprise plans offer unlimited access to IT job applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
