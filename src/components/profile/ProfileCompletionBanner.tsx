import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface ProfileCompletionBannerProps {
  completionPercentage: number;
  isMatchingEnabled: boolean;
  onEnableMatching?: () => void;
  className?: string;
}

export const ProfileCompletionBanner: React.FC<ProfileCompletionBannerProps> = ({
  completionPercentage,
  isMatchingEnabled,
  onEnableMatching,
  className = ''
}) => {
  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCompletionMessage = (percentage: number) => {
    if (percentage >= 80) return 'Your profile is complete! Enable matching to get personalized job recommendations.';
    if (percentage >= 60) return 'Almost there! Complete a few more sections to unlock intelligent job matching.';
    return 'Complete your profile to get AI-powered job recommendations tailored to your skills and preferences.';
  };

  if (completionPercentage >= 80 && isMatchingEnabled) {
    return (
      <Card className={`p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 ${className}`}>
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-green-900">
              Profile Complete & Matching Enabled
            </h3>
            <p className="text-sm text-green-700">
              You're all set! Check out your personalized job recommendations.
            </p>
          </div>
          <Link to="/recommended-jobs">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              View Matches
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${getCompletionColor(completionPercentage)} ${className}`}>
      <div className="flex items-start space-x-4">
        <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">
              Profile Completion: {completionPercentage}%
            </h3>
            <span className="text-sm font-medium">
              {completionPercentage >= 80 ? 'Complete' : 'In Progress'}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(completionPercentage)}`}
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
            />
          </div>

          <p className="text-sm mb-4">
            {getCompletionMessage(completionPercentage)}
          </p>

          <div className="flex items-center space-x-3">
            <Link to="/profile">
              <Button size="sm" variant="outline">
                Complete Profile
              </Button>
            </Link>
            
            {completionPercentage >= 80 && !isMatchingEnabled && onEnableMatching && (
              <Button size="sm" onClick={onEnableMatching}>
                Enable Matching
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
