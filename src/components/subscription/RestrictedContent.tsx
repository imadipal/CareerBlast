import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Crown, ArrowRight, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface RestrictedContentProps {
  type: 'candidate-data' | 'application-list' | 'resume-download' | 'contact-info';
  jobTitle?: string;
  candidateCount?: number;
  message?: string;
  showUpgradeButton?: boolean;
}

const RestrictedContent: React.FC<RestrictedContentProps> = ({
  type,
  jobTitle,
  candidateCount,
  message,
  showUpgradeButton = true
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/pricing');
  };

  const getContentConfig = () => {
    switch (type) {
      case 'candidate-data':
        return {
          icon: Users,
          title: 'Premium Candidate Data',
          description: message || 'This IT job candidate data requires an active subscription to view.',
          features: [
            'View detailed candidate profiles',
            'Access contact information',
            'Download resumes and portfolios',
            'See skills and experience details'
          ]
        };
      
      case 'application-list':
        return {
          icon: Lock,
          title: 'IT Job Applications',
          description: message || `${candidateCount || 'Multiple'} candidates have applied to this IT position. Subscribe to view applications.`,
          features: [
            'View all candidate applications',
            'Filter and sort applicants',
            'Access candidate profiles',
            'Manage application status'
          ]
        };
      
      case 'resume-download':
        return {
          icon: Lock,
          title: 'Resume Download',
          description: message || 'Resume download for IT job candidates requires an active subscription.',
          features: [
            'Download candidate resumes',
            'Access portfolio links',
            'View work samples',
            'Export candidate data'
          ]
        };
      
      case 'contact-info':
        return {
          icon: Lock,
          title: 'Contact Information',
          description: message || 'Contact details for IT job candidates require an active subscription.',
          features: [
            'View email addresses',
            'Access phone numbers',
            'See LinkedIn profiles',
            'Direct messaging capability'
          ]
        };
      
      default:
        return {
          icon: Lock,
          title: 'Premium Content',
          description: message || 'This content requires an active subscription.',
          features: []
        };
    }
  };

  const config = getContentConfig();

  // Don't show for non-employers
  if (user?.role !== 'employer') {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-8 text-center">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <config.icon className="w-8 h-8 text-purple-600" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {config.title}
        </h3>

        {/* Job Title */}
        {jobTitle && (
          <p className="text-sm text-purple-600 font-medium mb-3">
            {jobTitle}
          </p>
        )}

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {config.description}
        </p>

        {/* Features */}
        {config.features.length > 0 && (
          <div className="bg-white rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              What you'll get with a subscription:
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {config.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Crown className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upgrade Button */}
        {showUpgradeButton && (
          <button
            onClick={handleUpgrade}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center mx-auto"
          >
            <Crown className="w-5 h-5 mr-2" />
            Upgrade to Access
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        )}

        {/* Free Access Notice */}
        <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            <strong>Non-IT jobs remain completely free!</strong><br />
            Only IT job candidate data requires a subscription.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestrictedContent;
