import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  CheckCircle, 
  DollarSign, 
  Briefcase, 
  MapPin, 
  User,
  ArrowRight,
  X
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { ProfileValidationResult, ProfileCompletionStep } from '../../services/profileValidationService';

interface ProfileCompletionPromptProps {
  validationResult: ProfileValidationResult;
  completionSteps: ProfileCompletionStep[];
  onDismiss?: () => void;
  variant?: 'banner' | 'modal' | 'card';
  showDismiss?: boolean;
}

export const ProfileCompletionPrompt: React.FC<ProfileCompletionPromptProps> = ({
  validationResult,
  completionSteps,
  onDismiss,
  variant = 'card',
  showDismiss = true,
}) => {
  const navigate = useNavigate();

  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case 'basic_info':
        return User;
      case 'salary_expectation':
        return DollarSign;
      case 'experience_years':
        return Briefcase;
      case 'skills':
        return CheckCircle;
      case 'preferences':
        return MapPin;
      default:
        return CheckCircle;
    }
  };

  const getStepColor = (step: ProfileCompletionStep) => {
    if (step.isCompleted) {
      return 'text-green-600 bg-green-100';
    }
    if (step.isRequired) {
      return 'text-red-600 bg-red-100';
    }
    return 'text-blue-600 bg-blue-100';
  };

  const incompleteRequiredSteps = completionSteps.filter(step => step.isRequired && !step.isCompleted);
  const nextStep = incompleteRequiredSteps[0] || completionSteps.find(step => !step.isCompleted);

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Complete Your Profile</h3>
              <p className="text-sm text-gray-600">
                {validationResult.completionPercentage}% complete • 
                {incompleteRequiredSteps.length > 0 
                  ? ` ${incompleteRequiredSteps.length} required steps remaining`
                  : ' Ready for job matching!'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" onClick={() => navigate('/profile')}>
              Complete Profile
            </Button>
            {showDismiss && onDismiss && (
              <button
                onClick={onDismiss}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Complete Your Profile</h3>
            <p className="text-gray-600">
              Unlock personalized job recommendations with 70%+ match scores
            </p>
          </div>
        </div>
        {showDismiss && onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Profile Completion</span>
          <span className="text-sm font-bold text-brand-600">
            {validationResult.completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-brand-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${validationResult.completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Missing Required Fields */}
      {incompleteRequiredSteps.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
            Required for Job Matching
          </h4>
          <div className="space-y-3">
            {incompleteRequiredSteps.map((step) => {
              const Icon = getStepIcon(step.id);
              return (
                <div key={step.id} className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className={`p-2 rounded-lg ${getStepColor(step)}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{step.title}</h5>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/profile')}
                    className="flex items-center space-x-1"
                  >
                    <span>{step.action}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Next Recommended Step */}
      {nextStep && incompleteRequiredSteps.length === 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
            Recommended Next Step
          </h4>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className={`p-2 rounded-lg ${getStepColor(nextStep)}`}>
              {React.createElement(getStepIcon(nextStep.id), { className: "w-4 h-4" })}
            </div>
            <div className="flex-1">
              <h5 className="font-medium text-gray-900">{nextStep.title}</h5>
              <p className="text-sm text-gray-600">{nextStep.description}</p>
            </div>
            <Button
              size="sm"
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-1"
            >
              <span>{nextStep.action}</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Completion Steps Overview */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Profile Sections</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {completionSteps.map((step) => {
            const Icon = getStepIcon(step.id);
            return (
              <div key={step.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                <div className={`p-1.5 rounded-lg ${getStepColor(step)}`}>
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {step.title}
                    </span>
                    {step.isRequired && (
                      <span className="text-xs text-red-600 font-medium">Required</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600">{step.weight}% weight</span>
                    {step.isCompleted && (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      {validationResult.recommendations.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
          <ul className="space-y-2">
            {validationResult.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={() => navigate('/profile')}
          className="flex-1 sm:flex-none"
        >
          Complete Profile
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate('/jobs')}
          className="flex-1 sm:flex-none"
        >
          Browse All Jobs
        </Button>
        {validationResult.isValid && (
          <Button 
            variant="outline" 
            onClick={() => navigate('/smart-jobs')}
            className="flex-1 sm:flex-none"
          >
            View Recommendations
          </Button>
        )}
      </div>
    </Card>
  );
};

// Compact version for use in headers/sidebars
export const ProfileCompletionBadge: React.FC<{
  completionPercentage: number;
  hasRequiredData: boolean;
  onClick?: () => void;
}> = ({ completionPercentage, hasRequiredData, onClick }) => {
  const getStatusColor = () => {
    if (hasRequiredData) return 'bg-green-100 text-green-800 border-green-200';
    if (completionPercentage >= 50) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusIcon = () => {
    if (hasRequiredData) return CheckCircle;
    return AlertCircle;
  };

  const Icon = getStatusIcon();

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors hover:opacity-80 ${getStatusColor()}`}
    >
      <Icon className="w-3 h-3" />
      <span>Profile {completionPercentage}%</span>
    </button>
  );
};
