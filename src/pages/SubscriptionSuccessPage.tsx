import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download, Users } from 'lucide-react';
import { subscriptionAPI } from '../services/subscriptionAPI';

const SubscriptionSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state as { 
    plan?: string; 
    amount?: number; 
    billingCycle?: string 
  };

  useEffect(() => {
    // If no state, redirect to pricing
    if (!state?.plan) {
      navigate('/pricing');
    }
  }, [state, navigate]);

  const handleGoToDashboard = () => {
    navigate('/employer/dashboard');
  };

  const handleViewSubscription = () => {
    navigate('/subscription/manage');
  };

  if (!state?.plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Subscription Activated Successfully!
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to {state.plan}! Your subscription is now active and you can start 
            accessing premium IT talent right away.
          </p>
        </div>

        {/* Subscription Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Subscription Details</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Plan</h3>
              <p className="text-2xl font-bold text-purple-600">{state.plan}</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Amount Paid</h3>
              <p className="text-2xl font-bold text-blue-600">
                {subscriptionAPI.formatPrice(state.amount || 0)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Billing</h3>
              <p className="text-2xl font-bold text-green-600">{state.billingCycle}</p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">What's Next?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 rounded-full p-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Access IT Talent</h3>
                <p className="text-gray-600">
                  Start browsing and contacting qualified IT professionals for your job openings.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Download Resumes</h3>
                <p className="text-gray-600">
                  Download candidate resumes and contact information for IT job applications.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoToDashboard}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 flex items-center justify-center"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          
          <button
            onClick={handleViewSubscription}
            className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50"
          >
            Manage Subscription
          </button>
        </div>

        {/* Support Notice */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-blue-800 mb-4">
              Our support team is here to help you make the most of your subscription.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <span className="text-blue-700">📧 support@careerblast.com</span>
              <span className="text-blue-700">📞 +91-XXXX-XXXXXX</span>
            </div>
          </div>
        </div>

        {/* Receipt Notice */}
        <div className="mt-8 text-center text-gray-500">
          <p className="text-sm">
            A payment receipt has been sent to your email address. 
            You can also download invoices from your subscription management page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccessPage;
