import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import TeamManagement from '../components/team/TeamManagement';
import { Button } from '../components/ui';
import { Crown, Users, AlertCircle } from 'lucide-react';
import type { Organization } from '../types';

const TeamManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock organization data - in real app, fetch from API
    const mockOrganization: Organization = {
      id: 'org-1',
      name: 'Acme Corporation',
      subscriptionPlan: 'enterprise', // Change this to test different plans
      maxRecruiters: 10,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z',
      ownerId: user?.id || 'user-1',
      settings: {
        allowMultipleRecruiters: true,
        requireApprovalForNewMembers: false,
      }
    };

    setOrganization(mockOrganization);
    setLoading(false);
  }, [user]);

  const handleUpgradePlan = () => {
    // Redirect to pricing/upgrade page
    window.location.href = '/pricing';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Organization Not Found</h2>
          <p className="text-gray-600">Unable to load organization details.</p>
        </div>
      </div>
    );
  }

  // Check if user has access to team management
  const hasTeamAccess = organization.subscriptionPlan === 'enterprise';

  if (!hasTeamAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Team Management
              </h1>
              <p className="text-lg text-gray-600">
                Unlock the power of collaborative hiring
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Enterprise Feature
              </h2>
              <p className="text-gray-700 mb-6">
                Team management is available exclusively for Enterprise plan subscribers. 
                Add multiple recruiters, manage permissions, and collaborate effectively 
                with your hiring team.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Multiple Recruiters</h3>
                  <p className="text-sm text-gray-600">Add up to 10 team members</p>
                </div>
                <div className="text-center">
                  <Crown className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Role Management</h3>
                  <p className="text-sm text-gray-600">Admin and recruiter roles</p>
                </div>
                <div className="text-center">
                  <AlertCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Permission Control</h3>
                  <p className="text-sm text-gray-600">Granular access controls</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleUpgradePlan}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Upgrade to Enterprise
              </Button>
              
              <div className="text-sm text-gray-500">
                Current Plan: <span className="font-medium capitalize">{organization.subscriptionPlan}</span>
              </div>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="mt-12 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-lg font-medium text-gray-900">Plan Comparison</h3>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Feature</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Basic</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Premium</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-3 px-4 text-gray-900">Team Members</td>
                      <td className="py-3 px-4 text-center text-gray-600">1</td>
                      <td className="py-3 px-4 text-center text-gray-600">3</td>
                      <td className="py-3 px-4 text-center text-green-600 font-medium">10</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-900">Role Management</td>
                      <td className="py-3 px-4 text-center text-red-500">✗</td>
                      <td className="py-3 px-4 text-center text-yellow-500">Limited</td>
                      <td className="py-3 px-4 text-center text-green-500">✓</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-900">Permission Controls</td>
                      <td className="py-3 px-4 text-center text-red-500">✗</td>
                      <td className="py-3 px-4 text-center text-red-500">✗</td>
                      <td className="py-3 px-4 text-center text-green-500">✓</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-900">Team Analytics</td>
                      <td className="py-3 px-4 text-center text-red-500">✗</td>
                      <td className="py-3 px-4 text-center text-red-500">✗</td>
                      <td className="py-3 px-4 text-center text-green-500">✓</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeamManagement 
        organization={organization}
        onUpdateOrganization={setOrganization}
      />
    </div>
  );
};

export default TeamManagementPage;
