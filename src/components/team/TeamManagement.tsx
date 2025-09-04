import React, { useState, useEffect } from 'react';
import { Plus, Mail, Trash2, Edit, Check, X, Users, Shield, Eye } from 'lucide-react';
import { Button } from '../ui';
import type { TeamMember, TeamInvitation, Organization } from '../../types';

interface TeamManagementProps {
  organization: Organization;
  onUpdateOrganization?: (org: Organization) => void;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ 
  organization, 
  onUpdateOrganization 
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<TeamInvitation[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'pending'>('all');

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from API
    setTeamMembers([
      {
        id: '1',
        userId: 'user1',
        organizationId: organization.id,
        email: 'hagar7729@instrama.com',
        firstName: 'Sid',
        lastName: 'Thomas',
        role: 'admin',
        status: 'active',
        invitedAt: '2024-01-15T10:00:00Z',
        joinedAt: '2024-01-15T10:30:00Z',
        invitedBy: 'owner',
        permissions: {
          canPostJobs: true,
          canViewCandidates: true,
          canManageTeam: true,
          canViewAnalytics: true,
        }
      },
      {
        id: '2',
        userId: 'user2',
        organizationId: organization.id,
        email: 'jitji@instrama.com',
        firstName: 'Aditya',
        lastName: 'Pal',
        role: 'admin',
        status: 'active',
        invitedAt: '2024-01-16T09:00:00Z',
        joinedAt: '2024-01-16T09:15:00Z',
        invitedBy: 'user1',
        permissions: {
          canPostJobs: true,
          canViewCandidates: true,
          canManageTeam: false,
          canViewAnalytics: true,
        }
      }
    ]);

    setPendingInvitations([
      {
        id: 'inv1',
        organizationId: organization.id,
        email: 'newrecruiter@company.com',
        role: 'recruiter',
        invitedBy: 'user1',
        invitedAt: '2024-01-20T14:00:00Z',
        expiresAt: '2024-01-27T14:00:00Z',
        status: 'pending',
        token: 'invite-token-123'
      }
    ]);
  }, [organization.id]);

  const canAddMoreRecruiters = () => {
    return organization.subscriptionPlan === 'enterprise' && 
           teamMembers.length < organization.maxRecruiters;
  };

  const getFilteredMembers = () => {
    switch (filter) {
      case 'active':
        return teamMembers.filter(member => member.status === 'active');
      case 'pending':
        return [...teamMembers.filter(member => member.status === 'pending')];
      default:
        return teamMembers;
    }
  };

  const handleInviteMember = async (email: string, role: 'admin' | 'recruiter') => {
    if (!canAddMoreRecruiters()) {
      alert('You have reached the maximum number of team members for your plan.');
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would call an API
      const newInvitation: TeamInvitation = {
        id: `inv-${Date.now()}`,
        organizationId: organization.id,
        email,
        role,
        invitedBy: 'current-user',
        invitedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        token: `token-${Date.now()}`
      };

      setPendingInvitations(prev => [...prev, newInvitation]);
      setShowInviteForm(false);
      
      // Send invitation email (mock)
      console.log(`Invitation sent to ${email} for role ${role}`);
    } catch (error) {
      console.error('Failed to send invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'recruiter':
        return <Users className="w-4 h-4 text-green-600" />;
      default:
        return <Eye className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPlanBadge = (plan: string) => {
    const colors = {
      basic: 'bg-gray-100 text-gray-800',
      premium: 'bg-blue-100 text-blue-800',
      enterprise: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[plan as keyof typeof colors]}`}>
        {plan.charAt(0).toUpperCase() + plan.slice(1)}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Recruitment Team</h1>
            <p className="text-gray-600 mt-1">
              In order to hire more effectively, you can use Instahyre along with the rest of your hiring team. 
              Just add them below and click "Save Changes". We'll email an invitation to any new users you add.
            </p>
          </div>
          {getPlanBadge(organization.subscriptionPlan)}
        </div>
        
        <div className="text-sm text-blue-600">
          <a href="#" className="hover:underline">
            Click here to view our guide for using the Team page functionality.
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center space-x-6">
          <h3 className="font-medium text-gray-900">Filter by status</h3>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="filter"
                value="all"
                checked={filter === 'all'}
                onChange={(e) => setFilter(e.target.value as any)}
                className="mr-2"
              />
              <span className="text-sm">Active users ({teamMembers.filter(m => m.status === 'active').length})</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="filter"
                value="pending"
                checked={filter === 'pending'}
                onChange={(e) => setFilter(e.target.value as any)}
                className="mr-2"
              />
              <span className="text-sm">Deleted users ({teamMembers.filter(m => m.status === 'inactive').length})</span>
            </label>
          </div>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
            {canAddMoreRecruiters() && (
              <Button
                onClick={() => setShowInviteForm(true)}
                className="flex items-center"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add More
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFilteredMembers().map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRoleIcon(member.role)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {member.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPlanBadge(organization.subscriptionPlan)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {/* Pending Invitations */}
              {pendingInvitations.map((invitation) => (
                <tr key={invitation.id} className="hover:bg-gray-50 bg-yellow-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-yellow-300 flex items-center justify-center">
                          <Mail className="w-4 h-4 text-yellow-700" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          Pending Invitation
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invitation.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRoleIcon(invitation.role)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {invitation.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPlanBadge(organization.subscriptionPlan)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleCancelInvitation(invitation.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Cancel invitation"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="mt-6 flex justify-start">
        <Button className="bg-blue-600 hover:bg-blue-700">
          Save Changes
        </Button>
      </div>

      {/* Invite Form Modal */}
      {showInviteForm && (
        <InviteModal
          onClose={() => setShowInviteForm(false)}
          onInvite={handleInviteMember}
          loading={loading}
        />
      )}
    </div>
  );
};

// Invite Modal Component
interface InviteModalProps {
  onClose: () => void;
  onInvite: (email: string, role: 'admin' | 'recruiter') => void;
  loading: boolean;
}

const InviteModal: React.FC<InviteModalProps> = ({ onClose, onInvite, loading }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'recruiter'>('recruiter');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onInvite(email.trim(), role);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Invite Team Member</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'recruiter')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !email.trim()}
            >
              {loading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamManagement;
