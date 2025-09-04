import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Download, ExternalLink, Clock, Building, Mail, Phone, Shield, AlertCircle } from 'lucide-react';
import { Button, Card, Badge, Input } from '../ui';
import type { RecruiterApplication, RecruiterVerificationStats, User } from '../../types';

interface EnhancedRecruiterData extends RecruiterApplication {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    linkedinProfile: string;
    isEmailVerified: boolean;
    emailVerifiedAt: string;
  };
}

interface RecruiterReviewPanelProps {
  onApprove: (applicationId: string, notes?: string) => void;
  onReject: (applicationId: string, reason: string) => void;
}

const RecruiterReviewPanel: React.FC<RecruiterReviewPanelProps> = ({
  onApprove,
  onReject
}) => {
  const [applications, setApplications] = useState<EnhancedRecruiterData[]>([]);
  const [stats, setStats] = useState<RecruiterVerificationStats | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'under_review' | 'approved' | 'rejected'>('pending');
  const [selectedApplication, setSelectedApplication] = useState<RecruiterApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const mockApplications: EnhancedRecruiterData[] = [
      {
        id: 'app-1',
        userId: 'user-1',
        companyName: 'TechCorp Solutions',
        companyWebsite: 'https://techcorp.com',
        companySize: '51-200',
        industry: 'technology',
        jobTitle: 'Senior Talent Acquisition Manager',
        workEmail: 'sarah.johnson@techcorp.com',
        phoneNumber: '+1 (555) 123-4567',
        linkedinProfile: 'https://linkedin.com/in/sarahjohnson',
        companyDescription: 'Leading software development company specializing in enterprise solutions.',
        hiringNeeds: 'We are looking to hire 20+ software engineers, product managers, and designers over the next 6 months.',
        documents: {
          businessLicense: '/docs/business-license-1.pdf',
          companyLogo: '/logos/techcorp.png',
          identityProof: '/docs/id-proof-1.pdf',
        },
        status: 'pending',
        submittedAt: '2024-01-20T10:00:00Z',
        user: {
          id: 'user-1',
          email: 'sarah.johnson@techcorp.com',
          firstName: 'Sarah',
          lastName: 'Johnson',
          linkedinProfile: 'https://linkedin.com/in/sarahjohnson',
          isEmailVerified: true,
          emailVerifiedAt: '2024-01-20T10:05:00Z',
        },
      },
      {
        id: 'app-2',
        userId: 'user-2',
        companyName: 'HealthTech Innovations',
        companyWebsite: 'https://healthtech.io',
        companySize: '11-50',
        industry: 'healthcare',
        jobTitle: 'HR Director',
        workEmail: 'mike.chen@healthtech.io',
        phoneNumber: '+1 (555) 987-6543',
        linkedinProfile: 'https://linkedin.com/in/mikechen-hr',
        companyDescription: 'Healthcare technology startup focused on telemedicine solutions.',
        hiringNeeds: 'Rapid growth phase - need to hire across all departments, especially engineering and sales.',
        documents: {
          businessLicense: '/docs/business-license-2.pdf',
          companyLogo: '/logos/healthtech.png',
        },
        status: 'under_review',
        submittedAt: '2024-01-19T14:30:00Z',
        user: {
          id: 'user-2',
          email: 'mike.chen@healthtech.io',
          firstName: 'Mike',
          lastName: 'Chen',
          linkedinProfile: 'https://linkedin.com/in/mikechen-hr',
          isEmailVerified: true,
          emailVerifiedAt: '2024-01-19T14:35:00Z',
        },
      },
    ];

    const mockStats: RecruiterVerificationStats = {
      totalApplications: 45,
      pendingReview: 12,
      approved: 28,
      rejected: 5,
      averageReviewTime: 36, // hours
    };

    setApplications(mockApplications);
    setStats(mockStats);
  }, []);

  const filteredApplications = applications.filter(app => 
    filter === 'all' || app.status === filter
  );

  const handleApprove = async (applicationId: string) => {
    setLoading(true);
    try {
      await onApprove(applicationId);
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'approved', reviewedAt: new Date().toISOString() }
            : app
        )
      );
      setSelectedApplication(null);
    } catch (error) {
      console.error('Failed to approve application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (applicationId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setLoading(true);
    try {
      await onReject(applicationId, rejectionReason);
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { 
                ...app, 
                status: 'rejected', 
                reviewedAt: new Date().toISOString(),
                rejectionReason 
              }
            : app
        )
      );
      setSelectedApplication(null);
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Failed to reject application:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recruiter Verification</h1>
        <p className="text-gray-600">Review and approve recruiter applications</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReview}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Review Time</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageReviewTime}h</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {[
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'under_review', label: 'Under Review' },
            { key: 'approved', label: 'Approved' },
            { key: 'rejected', label: 'Rejected' },
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredApplications.map((application) => (
          <Card key={application.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{application.companyName}</h3>
                <p className="text-sm text-gray-600">{application.jobTitle}</p>
              </div>
              {getStatusBadge(application.status)}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <span>{application.workEmail}</span>
                {application.user.isEmailVerified ? (
                  <Shield className="w-4 h-4 ml-2 text-green-600" title="Email Verified" />
                ) : (
                  <AlertCircle className="w-4 h-4 ml-2 text-red-600" title="Email Not Verified" />
                )}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {application.phoneNumber}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ExternalLink className="w-4 h-4 mr-2" />
                <a
                  href={application.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {application.companyWebsite}
                </a>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ExternalLink className="w-4 h-4 mr-2" />
                <a
                  href={application.user.linkedinProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  LinkedIn Profile
                </a>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 line-clamp-2">
                {application.companyDescription}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>Submitted {getTimeAgo(application.submittedAt)}</span>
              <span>{application.companySize} • {application.industry}</span>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedApplication(application)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Review
              </Button>
              
              {application.status === 'pending' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(application.id)}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedApplication(application);
                      setShowRejectModal(true);
                    }}
                    disabled={loading}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
          <p className="text-gray-600">No recruiter applications match the current filter.</p>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Application</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this application. This will be shared with the applicant.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedApplication && handleReject(selectedApplication.id)}
                disabled={loading || !rejectionReason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? 'Rejecting...' : 'Reject Application'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterReviewPanel;
