import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import TeamService from '../services/teamService';
import type { Organization, TeamMember, TeamInvitation } from '../types';

interface UseTeamManagementReturn {
  organization: Organization | null;
  teamMembers: TeamMember[];
  pendingInvitations: TeamInvitation[];
  loading: boolean;
  error: string | null;
  
  // Actions
  inviteTeamMember: (email: string, role: 'admin' | 'recruiter') => Promise<void>;
  removeTeamMember: (memberId: string) => Promise<void>;
  cancelInvitation: (invitationId: string) => Promise<void>;
  updateTeamMember: (memberId: string, updates: Partial<Pick<TeamMember, 'role' | 'permissions'>>) => Promise<void>;
  resendInvitation: (invitationId: string) => Promise<void>;
  refreshData: () => Promise<void>;
  
  // Utilities
  canAddMoreMembers: () => boolean;
  validateInvitationEmail: (email: string) => { isValid: boolean; error?: string };
}

export const useTeamManagement = (organizationId?: string): UseTeamManagementReturn => {
  const { token } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<TeamInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!organizationId || !token) return;

    try {
      setLoading(true);
      setError(null);

      const [orgData, membersData, invitationsData] = await Promise.all([
        TeamService.getOrganization(organizationId, token),
        TeamService.getTeamMembers(organizationId, token),
        TeamService.getPendingInvitations(organizationId, token),
      ]);

      setOrganization(orgData);
      setTeamMembers(membersData);
      setPendingInvitations(invitationsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team data');
      console.error('Error fetching team data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [organizationId, token]);

  const inviteTeamMember = async (email: string, role: 'admin' | 'recruiter') => {
    if (!organizationId || !token) throw new Error('Missing organization or authentication');

    // Validate email
    const validation = TeamService.validateInvitationEmail(email, teamMembers, pendingInvitations);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Check if can add more members
    if (!canAddMoreMembers()) {
      throw new Error('You have reached the maximum number of team members for your plan');
    }

    try {
      const invitation = await TeamService.inviteTeamMember(organizationId, email, role, token);
      setPendingInvitations(prev => [...prev, invitation]);
    } catch (err) {
      throw err;
    }
  };

  const removeTeamMember = async (memberId: string) => {
    if (!organizationId || !token) throw new Error('Missing organization or authentication');

    try {
      await TeamService.removeTeamMember(organizationId, memberId, token);
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    } catch (err) {
      throw err;
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    if (!organizationId || !token) throw new Error('Missing organization or authentication');

    try {
      await TeamService.cancelInvitation(organizationId, invitationId, token);
      setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    } catch (err) {
      throw err;
    }
  };

  const updateTeamMember = async (
    memberId: string, 
    updates: Partial<Pick<TeamMember, 'role' | 'permissions'>>
  ) => {
    if (!organizationId || !token) throw new Error('Missing organization or authentication');

    try {
      const updatedMember = await TeamService.updateTeamMember(organizationId, memberId, updates, token);
      setTeamMembers(prev => 
        prev.map(member => member.id === memberId ? updatedMember : member)
      );
    } catch (err) {
      throw err;
    }
  };

  const resendInvitation = async (invitationId: string) => {
    if (!organizationId || !token) throw new Error('Missing organization or authentication');

    try {
      await TeamService.resendInvitation(organizationId, invitationId, token);
      // Update the invitation timestamp
      setPendingInvitations(prev =>
        prev.map(inv => 
          inv.id === invitationId 
            ? { ...inv, invitedAt: new Date().toISOString() }
            : inv
        )
      );
    } catch (err) {
      throw err;
    }
  };

  const refreshData = async () => {
    await fetchData();
  };

  const canAddMoreMembers = (): boolean => {
    if (!organization) return false;
    return TeamService.canAddMoreMembers(organization, teamMembers.length);
  };

  const validateInvitationEmail = (email: string): { isValid: boolean; error?: string } => {
    return TeamService.validateInvitationEmail(email, teamMembers, pendingInvitations);
  };

  return {
    organization,
    teamMembers,
    pendingInvitations,
    loading,
    error,
    inviteTeamMember,
    removeTeamMember,
    cancelInvitation,
    updateTeamMember,
    resendInvitation,
    refreshData,
    canAddMoreMembers,
    validateInvitationEmail,
  };
};

export default useTeamManagement;
