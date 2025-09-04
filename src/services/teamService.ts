import type { Organization, TeamMember, TeamInvitation } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth headers
const getAuthHeaders = (token?: string | null) => ({
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` }),
});

export class TeamService {
  /**
   * Get organization details
   */
  static async getOrganization(organizationId: string, token: string): Promise<Organization> {
    const response = await fetch(
      `${API_BASE_URL}/organizations/${organizationId}`,
      {
        headers: getAuthHeaders(token),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch organization');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Get team members for an organization
   */
  static async getTeamMembers(organizationId: string, token: string): Promise<TeamMember[]> {
    const response = await fetch(
      `${API_BASE_URL}/organizations/${organizationId}/members`,
      {
        headers: getAuthHeaders(token),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch team members');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Get pending invitations for an organization
   */
  static async getPendingInvitations(organizationId: string, token: string): Promise<TeamInvitation[]> {
    const response = await fetch(
      `${API_BASE_URL}/organizations/${organizationId}/invitations`,
      {
        headers: getAuthHeaders(token),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch invitations');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Invite a new team member
   */
  static async inviteTeamMember(
    organizationId: string,
    email: string,
    role: 'admin' | 'recruiter',
    token: string
  ): Promise<TeamInvitation> {
    const response = await fetch(
      `${API_BASE_URL}/organizations/${organizationId}/invite`,
      {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          email,
          role,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send invitation');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Remove a team member
   */
  static async removeTeamMember(
    organizationId: string,
    memberId: string,
    token: string
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/organizations/${organizationId}/members/${memberId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to remove team member');
    }
  }

  /**
   * Cancel a pending invitation
   */
  static async cancelInvitation(
    organizationId: string,
    invitationId: string,
    token: string
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/organizations/${organizationId}/invitations/${invitationId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to cancel invitation');
    }
  }

  /**
   * Update team member role and permissions
   */
  static async updateTeamMember(
    organizationId: string,
    memberId: string,
    updates: Partial<Pick<TeamMember, 'role' | 'permissions'>>,
    token: string
  ): Promise<TeamMember> {
    const response = await fetch(
      `${API_BASE_URL}/organizations/${organizationId}/members/${memberId}`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(token),
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update team member');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Resend invitation
   */
  static async resendInvitation(
    organizationId: string,
    invitationId: string,
    token: string
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/organizations/${organizationId}/invitations/${invitationId}/resend`,
      {
        method: 'POST',
        headers: getAuthHeaders(token),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to resend invitation');
    }
  }

  /**
   * Accept invitation (for invited users)
   */
  static async acceptInvitation(token: string, invitationToken: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/invitations/accept`,
      {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          token: invitationToken,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to accept invitation');
    }
  }

  /**
   * Check if organization can add more members
   */
  static canAddMoreMembers(organization: Organization, currentMemberCount: number): boolean {
    return organization.subscriptionPlan === 'enterprise' && 
           currentMemberCount < organization.maxRecruiters;
  }

  /**
   * Get plan limits
   */
  static getPlanLimits(plan: string): { maxRecruiters: number; hasTeamManagement: boolean } {
    switch (plan) {
      case 'basic':
        return { maxRecruiters: 1, hasTeamManagement: false };
      case 'premium':
        return { maxRecruiters: 3, hasTeamManagement: false };
      case 'enterprise':
        return { maxRecruiters: 10, hasTeamManagement: true };
      default:
        return { maxRecruiters: 1, hasTeamManagement: false };
    }
  }

  /**
   * Validate email for invitation
   */
  static validateInvitationEmail(email: string, existingMembers: TeamMember[], pendingInvitations: TeamInvitation[]): {
    isValid: boolean;
    error?: string;
  } {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }

    // Check if already a member
    const existingMember = existingMembers.find(member => 
      member.email.toLowerCase() === email.toLowerCase()
    );
    if (existingMember) {
      return { isValid: false, error: 'This email is already a team member' };
    }

    // Check if already invited
    const pendingInvitation = pendingInvitations.find(invitation => 
      invitation.email.toLowerCase() === email.toLowerCase() && 
      invitation.status === 'pending'
    );
    if (pendingInvitation) {
      return { isValid: false, error: 'An invitation has already been sent to this email' };
    }

    return { isValid: true };
  }
}

export default TeamService;
