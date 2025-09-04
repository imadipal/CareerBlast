import React from 'react';
import { Briefcase, Users, Eye, TrendingUp } from 'lucide-react';
import { Card } from '../ui';

interface DashboardStatsProps {
  stats: {
    activeJobs: number;
    totalApplications: number;
    profileViews: number;
    hiredCandidates: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statItems = [
    {
      label: 'Active Jobs',
      value: stats.activeJobs,
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Total Applications',
      value: stats.totalApplications,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Profile Views',
      value: stats.profileViews,
      icon: Eye,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Hired Candidates',
      value: stats.hiredCandidates,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((item) => (
        <Card key={item.label} className="p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${item.bgColor}`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
