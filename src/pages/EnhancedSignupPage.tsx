import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import EnhancedSignupForm from '../components/auth/EnhancedSignupForm';
import EmailVerificationForm from '../components/auth/EmailVerificationForm';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui';
import type { SignupForm } from '../types';

type SignupStep = 'form' | 'email-verification' | 'success' | 'pending-approval';

const EnhancedSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [currentStep, setCurrentStep] = useState<SignupStep>('form');
  const [signupData, setSignupData] = useState<SignupForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignupSubmit = async (data: SignupForm) => {
    setLoading(true);
    setError(null);
    
    try {
      // Store signup data for later use
      setSignupData(data);
      
      // Send OTP to email
      await sendEmailOTP(data.email);
      
      // Move to email verification step
      setCurrentStep('email-verification');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  const sendEmailOTP = async (email: string) => {
    // In real app, call API to send OTP
    const response = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send OTP');
    }

    // Mock delay for demo
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleEmailVerification = async (otp: string) => {
    if (!signupData) return;

    setLoading(true);
    setError(null);

    try {
      // Verify OTP
      await verifyEmailOTP(signupData.email, otp);
      
      // Create account after email verification
      await signup(signupData);
      
      // Determine next step based on role
      if (signupData.role === 'employer') {
        setCurrentStep('pending-approval');
      } else {
        setCurrentStep('success');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailOTP = async (email: string, otp: string) => {
    // In real app, call API to verify OTP
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Invalid verification code');
    }

    // Mock delay for demo
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleResendOTP = async () => {
    if (!signupData) return;
    
    setError(null);
    try {
      await sendEmailOTP(signupData.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
    }
  };

  // Success page for candidates
  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Created Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Welcome to CareerBlast! Your account has been created and verified. 
            You can now start exploring job opportunities.
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/jobs')} className="w-full">
              Start Job Search
            </Button>
            <Button variant="outline" onClick={() => navigate('/profile')} className="w-full">
              Complete Your Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Pending approval page for recruiters
  if (currentStep === 'pending-approval') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Created - Pending Approval</h1>
          <p className="text-gray-600 mb-4">
            Your recruiter account has been created successfully! However, all recruiter accounts 
            require manual approval from our team.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Our team will review your LinkedIn profile</li>
              <li>• We'll verify your company email domain</li>
              <li>• You'll receive an email notification once approved</li>
              <li>• Approval typically takes 1-2 business days</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Account Details:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Email:</strong> {signupData?.email}</p>
              <p><strong>Company:</strong> {signupData?.companyName}</p>
              <p><strong>LinkedIn:</strong> 
                <a 
                  href={signupData?.linkedinProfile} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  View Profile
                </a>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={() => navigate('/')} className="w-full">
              Back to Home
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')} className="w-full">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Email verification step
  if (currentStep === 'email-verification' && signupData) {
    return (
      <EmailVerificationForm
        email={signupData.email}
        onVerificationComplete={handleEmailVerification}
        onResendOTP={handleResendOTP}
        loading={loading}
        error={error}
      />
    );
  }

  // Initial signup form
  return (
    <EnhancedSignupForm
      onSubmit={handleSignupSubmit}
      loading={loading}
    />
  );
};

export default EnhancedSignupPage;
