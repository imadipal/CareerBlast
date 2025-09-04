import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Crown, ArrowRight, X } from 'lucide-react';
import { subscriptionAPI } from '../../services/subscriptionAPI';
import { useAuth } from '../../hooks/useAuth';
import type { SubscriptionStatus } from '../../types/subscription';

interface SubscriptionStatusBannerProps {
  jobCategory?: 'IT' | 'NON_IT';
  showForAllJobs?: boolean;
}

const SubscriptionStatusBanner: React.FC<SubscriptionStatusBannerProps> = ({ 
  jobCategory = 'IT',
  showForAllJobs = false 
}) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'employer') {
      loadSubscriptionStatus();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadSubscriptionStatus = async () => {
    try {
      const status = await subscriptionAPI.getSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Error loading subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  // Don't show for non-employers
  if (user?.role !== 'employer') {
    return null;
  }

  // Don't show if loading or dismissed
  if (loading || dismissed) {
    return null;
  }

  // Don't show for non-IT jobs unless showForAllJobs is true
  if (jobCategory === 'NON_IT' && !showForAllJobs) {
    return null;
  }

  // Don't show if user has active subscription and can access more
  if (subscriptionStatus?.hasActiveSubscription && subscriptionStatus?.canAccessMoreApplications) {
    return null;
  }

  const getBannerContent = () => {
    if (!subscriptionStatus?.hasActiveSubscription) {
      return {
        type: 'warning' as const,
        icon: Crown,
        title: 'Subscription Required for IT Jobs',
        message: 'Access premium IT talent with a subscription. Non-IT jobs remain free.',
        actionText: 'View Plans',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-600',
        buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
      };
    }

    if (!subscriptionStatus?.canAccessMoreApplications) {
      return {
        type: 'error' as const,
        icon: AlertTriangle,
        title: 'Monthly Limit Reached',
        message: `You've reached your monthly limit. Remaining: ${subscriptionStatus.remainingApplications} applications.`,
        actionText: 'Upgrade Plan',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-600',
        buttonColor: 'bg-red-600 hover:bg-red-700'
      };
    }

    return null;
  };

  const bannerContent = getBannerContent();
  if (!bannerContent) {
    return null;
  }

  return (
    <div className={`${bannerContent.bgColor} ${bannerContent.borderColor} border rounded-lg p-4 mb-6`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <bannerContent.icon className={`w-6 h-6 ${bannerContent.iconColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <h3 className={`font-semibold ${bannerContent.textColor} mb-1`}>
              {bannerContent.title}
            </h3>
            <p className={`text-sm ${bannerContent.textColor} mb-3`}>
              {bannerContent.message}
            </p>
            <button
              onClick={handleUpgrade}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg ${bannerContent.buttonColor} transition-colors`}
            >
              {bannerContent.actionText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className={`${bannerContent.textColor} hover:opacity-75 transition-opacity`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SubscriptionStatusBanner;
