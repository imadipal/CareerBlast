import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, FileText, User, Briefcase, ArrowRight, SkipForward } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ResumeSection } from '../components/resume/ResumeSection';
import { useAuth } from '../hooks/useAuth';
import { useResume } from '../hooks/useResume';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { resumeInfo } = useResume();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to MyNexJob!',
      description: 'Let\'s get your profile set up to find the perfect job matches.',
      icon: User,
      component: WelcomeStep
    },
    {
      id: 'resume',
      title: 'Upload Your Resume (Required)',
      description: 'Resume upload is mandatory for all candidates to access job features.',
      icon: FileText,
      component: ResumeStep
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Your profile is ready. Start exploring job opportunities.',
      icon: CheckCircle,
      component: CompleteStep
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      navigate('/recommended-jobs');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    navigate('/recommended-jobs');
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Only show for candidates
  if (user?.role !== 'candidate') {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Getting Started</h1>
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <currentStepData.icon className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600">
              {currentStepData.description}
            </p>
          </div>

          <currentStepData.component 
            onNext={handleNext}
            onSkip={handleSkip}
            onBack={handleBack}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
          />
        </Card>
      </div>
    </div>
  );
};

// Welcome Step Component
const WelcomeStep: React.FC<{
  onNext: () => void;
  onSkip: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}> = ({ onNext }) => {
  const { user } = useAuth();

  return (
    <div className="text-center">
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Hi {user?.firstName}! 👋
        </h3>
        <p className="text-gray-600 mb-6">
          We're excited to help you find your next career opportunity. 
          Let's set up your profile to get personalized job recommendations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-blue-50 rounded-lg">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Upload Resume</h4>
            <p className="text-sm text-gray-600">Share your experience with employers</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <Briefcase className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Get Matched</h4>
            <p className="text-sm text-gray-600">Find jobs that fit your skills</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Apply Easily</h4>
            <p className="text-sm text-gray-600">One-click applications</p>
          </div>
        </div>
      </div>

      <Button onClick={onNext} size="lg" className="w-full sm:w-auto">
        Get Started
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

// Resume Step Component
const ResumeStep: React.FC<{
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}> = ({ onNext, onSkip, onBack }) => {
  const { resumeInfo } = useResume();

  return (
    <div>
      <ResumeSection
        showTitle={false}
        description="⚠️ Resume upload is REQUIRED for all candidates. You cannot proceed without uploading your resume."
        className="mb-8"
      />

      {!resumeInfo?.hasResume && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm font-medium">
            📋 Resume upload is mandatory to continue. Please upload your resume above to proceed to the next step.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        
        <div className="flex gap-4">
          {/* Remove skip option - resume is mandatory */}
          <Button
            onClick={onNext}
            disabled={!resumeInfo?.hasResume}
            className={!resumeInfo?.hasResume ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {resumeInfo?.hasResume ? 'Continue' : 'Upload Resume to Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Complete Step Component
const CompleteStep: React.FC<{
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}> = ({ onNext, onBack }) => {
  const { resumeInfo } = useResume();

  return (
    <div className="text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Welcome to MyNexJob! 🎉
        </h3>
        
        <p className="text-gray-600 mb-6">
          Your profile is set up and ready to go. 
          {resumeInfo?.hasResume 
            ? ' Your resume has been uploaded successfully.'
            : ' You can always upload your resume later from your profile.'
          }
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Browse personalized job recommendations</li>
            <li>• Complete your profile for better matches</li>
            <li>• Apply to jobs with one click</li>
            <li>• Track your applications</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        
        <Button onClick={onNext} size="lg">
          Start Job Hunting
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default WelcomePage;
