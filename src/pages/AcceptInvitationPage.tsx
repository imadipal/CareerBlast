import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import TeamService from '../services/teamService';
import { Button } from '../components/ui';
import { CheckCircle, XCircle, Mail, Users } from 'lucide-react';

const AcceptInvitationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [error, setError] = useState<string | null>(null);

  const invitationToken = searchParams.get('token');

  useEffect(() => {
    if (!invitationToken) {
      setStatus('error');
      setError('Invalid invitation link');
      return;
    }

    if (!user) {
      // Redirect to login with return URL
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
  }, [invitationToken, user, navigate]);

  const handleAcceptInvitation = async () => {
    if (!token || !invitationToken) return;

    setLoading(true);
    try {
      await TeamService.acceptInvitation(token, invitationToken);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to accept invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (!invitationToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
          <p className="text-gray-600 mb-6">
            This invitation link is invalid or has expired.
          </p>
          <Button onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Invitation</h1>
          <p className="text-gray-600 mb-6">
            Please log in to accept this team invitation.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Team!</h1>
          <p className="text-gray-600 mb-6">
            You have successfully joined the organization. You can now access team features and collaborate with your colleagues.
          </p>
          <div className="space-y-3">
            <Button onClick={handleGoToDashboard} className="w-full">
              Go to Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/team')}
              className="w-full"
            >
              View Team
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invitation Error</h1>
          <p className="text-gray-600 mb-6">
            {error || 'There was an error processing your invitation. Please try again or contact support.'}
          </p>
          <div className="space-y-3">
            <Button onClick={handleAcceptInvitation} className="w-full">
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Pending state - show invitation details and accept button
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <Users className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Invitation</h1>
        <p className="text-gray-600 mb-2">
          Hello <span className="font-medium">{user.firstName}</span>!
        </p>
        <p className="text-gray-600 mb-6">
          You've been invited to join a recruitment team. Accept this invitation to start collaborating with your colleagues.
        </p>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <Mail className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-900">Invitation Details</span>
          </div>
          <p className="text-sm text-blue-800">
            Email: <span className="font-medium">{user.email}</span>
          </p>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={handleAcceptInvitation}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Accepting...
              </div>
            ) : (
              'Accept Invitation'
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            disabled={loading}
            className="w-full"
          >
            Decline
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          By accepting this invitation, you agree to join the organization's recruitment team.
        </p>
      </div>
    </div>
  );
};

export default AcceptInvitationPage;
