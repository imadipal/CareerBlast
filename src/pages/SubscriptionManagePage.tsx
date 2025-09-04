import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Calendar, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { subscriptionAPI } from '../services/subscriptionAPI';
import type { Subscription, SubscriptionStatus } from '../types/subscription';

const SubscriptionManagePage: React.FC = () => {
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const [subscription, status, history] = await Promise.all([
        subscriptionAPI.getCurrentSubscription(),
        subscriptionAPI.getSubscriptionStatus(),
        subscriptionAPI.getSubscriptionHistory()
      ]);
      
      setCurrentSubscription(subscription);
      setSubscriptionStatus(status);
      setSubscriptionHistory(history);
    } catch (err) {
      setError('Failed to load subscription data');
      console.error('Error loading subscription data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access to IT job applications at the end of your current billing period.')) {
      return;
    }

    try {
      setCancelling(true);
      await subscriptionAPI.cancelSubscription();
      await loadSubscriptionData(); // Reload data
      alert('Subscription cancelled successfully. You will continue to have access until the end of your current billing period.');
    } catch (err) {
      alert('Failed to cancel subscription. Please contact support.');
      console.error('Error cancelling subscription:', err);
    } finally {
      setCancelling(false);
    }
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? CheckCircle : XCircle;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadSubscriptionData}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-gray-600 mt-2">Manage your IT job access subscription</p>
        </div>

        {/* Current Subscription Status */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Subscription</h2>
              
              {currentSubscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{currentSubscription.plan} Plan</h3>
                      <p className="text-gray-600">Billing: {currentSubscription.billingCycle}</p>
                    </div>
                    <div className="flex items-center">
                      {React.createElement(getStatusIcon(currentSubscription.isActive), {
                        className: `w-6 h-6 ${getStatusColor(currentSubscription.isActive)}`
                      })}
                      <span className={`ml-2 font-medium ${getStatusColor(currentSubscription.isActive)}`}>
                        {currentSubscription.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium">{formatDate(currentSubscription.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">End Date</p>
                      <p className="font-medium">{formatDate(currentSubscription.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount Paid</p>
                      <p className="font-medium">{subscriptionAPI.formatPrice(currentSubscription.amountPaid)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Applications Used</p>
                      <p className="font-medium">{currentSubscription.applicationsUsed}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleUpgrade}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
                    >
                      Upgrade Plan
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                    
                    {currentSubscription.isActive && (
                      <button
                        onClick={handleCancelSubscription}
                        disabled={cancelling}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
                  <p className="text-gray-600 mb-4">
                    Subscribe to access premium IT talent and candidate data.
                  </p>
                  <button
                    onClick={handleUpgrade}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                  >
                    View Plans
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>
              
              {subscriptionStatus && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Remaining Applications</span>
                    <span className="font-semibold text-purple-600">
                      {subscriptionStatus.remainingApplications === -1 
                        ? 'Unlimited' 
                        : subscriptionStatus.remainingApplications
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Can Access More</span>
                    <span className={`font-semibold ${
                      subscriptionStatus.canAccessMoreApplications ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {subscriptionStatus.canAccessMoreApplications ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need More Access?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Upgrade to a higher plan for more IT job applications and premium features.
              </p>
              <button
                onClick={handleUpgrade}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 text-sm"
              >
                Explore Plans
              </button>
            </div>
          </div>
        </div>

        {/* Subscription History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription History</h2>
          
          {subscriptionHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Plan</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Period</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptionHistory.map((subscription) => (
                    <tr key={subscription.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">{subscription.plan}</td>
                      <td className="py-3 px-4">{subscription.billingCycle}</td>
                      <td className="py-3 px-4">{subscriptionAPI.formatPrice(subscription.amountPaid)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          subscription.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {subscription.isActive ? 'Active' : 'Expired'}
                        </span>
                      </td>
                      <td className="py-3 px-4">{formatDate(subscription.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No subscription history found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagePage;
