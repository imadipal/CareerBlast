import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, AlertTriangle, Upload, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useResume } from '../../hooks/useResume';

interface ResumeRequiredGuardProps {
  children: React.ReactNode;
  message?: string;
  showUploadOption?: boolean;
  redirectTo?: string;
  className?: string;
}

/**
 * Guard component that blocks access to features requiring a resume
 * Shows a message and upload option if resume is not uploaded
 */
export const ResumeRequiredGuard: React.FC<ResumeRequiredGuardProps> = ({
  children,
  message = "Resume required to access this feature",
  showUploadOption = true,
  redirectTo = '/resume',
  className = ''
}) => {
  const navigate = useNavigate();
  const { resumeInfo, loading } = useResume();

  // Show loading while checking resume status
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If resume exists, show the protected content
  if (resumeInfo?.hasResume) {
    return <>{children}</>;
  }

  // If no resume, show the blocking message
  return (
    <div className={className}>
      <Card className="p-8 text-center bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Resume Required
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {message}. All candidates must upload their resume to access job features and recommendations.
        </p>

        <div className="bg-red-100 border border-red-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800 text-left">
              <p className="font-medium mb-1">Why is resume required?</p>
              <ul className="space-y-1">
                <li>• Helps employers understand your background</li>
                <li>• Enables accurate job matching</li>
                <li>• Required for job applications</li>
                <li>• Improves your profile visibility</li>
              </ul>
            </div>
          </div>
        </div>

        {showUploadOption && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate(redirectTo)}
              className="flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Resume Now</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Go to Profile</span>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

/**
 * Hook to check if user has uploaded resume
 */
export const useResumeRequired = () => {
  const { resumeInfo, loading } = useResume();
  
  return {
    hasResume: resumeInfo?.hasResume || false,
    loading,
    isResumeRequired: !resumeInfo?.hasResume && !loading
  };
};

/**
 * Higher-order component that wraps components requiring resume
 */
export const withResumeRequired = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    message?: string;
    redirectTo?: string;
  }
) => {
  return (props: P) => (
    <ResumeRequiredGuard 
      message={options?.message}
      redirectTo={options?.redirectTo}
    >
      <Component {...props} />
    </ResumeRequiredGuard>
  );
};

export default ResumeRequiredGuard;
