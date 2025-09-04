import React from 'react';
import { useAuth } from '../hooks/useAuth';
import RecruiterReviewPanel from '../components/admin/RecruiterReviewPanel';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui';
import { useNavigate } from 'react-router-dom';

const AdminRecruiterManagementPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            This page is only accessible to administrators.
          </p>
          <Button onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleApproveRecruiter = async (applicationId: string, notes?: string) => {
    try {
      // In real app, call API to approve recruiter
      const response = await fetch(`/api/admin/recruiters/${applicationId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve recruiter');
      }

      // Send approval email
      console.log(`Recruiter application ${applicationId} approved`);
    } catch (error) {
      console.error('Error approving recruiter:', error);
      throw error;
    }
  };

  const handleRejectRecruiter = async (applicationId: string, reason: string) => {
    try {
      // In real app, call API to reject recruiter
      const response = await fetch(`/api/admin/recruiters/${applicationId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject recruiter');
      }

      // Send rejection email
      console.log(`Recruiter application ${applicationId} rejected: ${reason}`);
    } catch (error) {
      console.error('Error rejecting recruiter:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RecruiterReviewPanel
        onApprove={handleApproveRecruiter}
        onReject={handleRejectRecruiter}
      />
    </div>
  );
};

export default AdminRecruiterManagementPage;
