import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RecruiterApplicationForm from '../components/recruiter/RecruiterApplicationForm';
import { CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui';
import type { RecruiterApplication } from '../types';

const RecruiterApplicationPage: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [application, setApplication] = useState<RecruiterApplication | null>(null);

  useEffect(() => {
    // Check if user is already approved or has pending application
    if (user?.role === 'employer') {
      if (user.isApproved) {
        setApplicationStatus('approved');
      } else if (user.approvalStatus === 'pending') {
        setApplicationStatus('pending');
      } else if (user.approvalStatus === 'rejected') {
        setApplicationStatus('rejected');
      }
    }

    // In real app, fetch existing application if any
    // fetchExistingApplication();
  }, [user]);

  const handleSubmitApplication = async (applicationData: Omit<RecruiterApplication, 'id' | 'userId' | 'status' | 'submittedAt'>) => {
    if (!user || !token) return;

    setLoading(true);
    try {
      // In real app, submit to API
      const newApplication: RecruiterApplication = {
        ...applicationData,
        id: `app-${Date.now()}`,
        userId: user.id,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setApplication(newApplication);
      setApplicationStatus('pending');
      
      // Show success message
      alert('Application submitted successfully! You will receive an email notification once reviewed.');
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResubmit = () => {
    setApplicationStatus('none');
    setApplication(null);
  };

  // Redirect if user is not an employer
  if (user && user.role !== 'employer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            This page is only accessible to employer accounts.
          </p>
          <Button onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  // Show pending status
  if (applicationStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Under Review</h1>
          <p className="text-gray-600 mb-6">
            Your recruiter verification application is currently being reviewed by our team. 
            You'll receive an email notification once the review is complete.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Submitted:</strong> {application?.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'Recently'}
            </p>
            <p className="text-sm text-blue-800 mt-1">
              <strong>Expected Review Time:</strong> 2-3 business days
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Show approved status
  if (applicationStatus === 'approved') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Approved!</h1>
          <p className="text-gray-600 mb-6">
            Congratulations! Your recruiter account has been verified and approved. 
            You now have full access to our platform.
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/pricing')} className="w-full">
              View Pricing Plans
            </Button>
            <Button variant="outline" onClick={() => navigate('/employer/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show rejected status
  if (applicationStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Rejected</h1>
          <p className="text-gray-600 mb-4">
            Unfortunately, your recruiter verification application was not approved.
          </p>
          {user?.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                <strong>Reason:</strong> {user.rejectionReason}
              </p>
            </div>
          )}
          <div className="space-y-3">
            <Button onClick={handleResubmit} className="w-full">
              Submit New Application
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show application form
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <RecruiterApplicationForm 
        onSubmit={handleSubmitApplication}
        loading={loading}
      />
    </div>
  );
};

export default RecruiterApplicationPage;
