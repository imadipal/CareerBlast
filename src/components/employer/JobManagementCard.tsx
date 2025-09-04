import React from 'react';
import { MapPin, Clock, Users, DollarSign, Eye, Edit, Trash2 } from 'lucide-react';
import type { Job } from '../../types';
import { Card, Badge, Button } from '../ui';

interface JobManagementCardProps {
  job: Job;
  applicationsCount: number;
  onEdit: (jobId: string) => void;
  onDelete: (jobId: string) => void;
  onViewApplications: (jobId: string) => void;
  onToggleStatus: (jobId: string) => void;
}

export const JobManagementCard: React.FC<JobManagementCardProps> = ({
  job,
  applicationsCount,
  onEdit,
  onDelete,
  onViewApplications,
  onToggleStatus,
}) => {
  const formatSalary = (min: number, max: number, _currency: string) => {
    const formatAmount = (amount: number) => {
      if (amount >= 10000000) {
        return `${(amount / 10000000).toFixed(1)}Cr`;
      } else if (amount >= 100000) {
        return `${(amount / 100000).toFixed(1)}L`;
      } else {
        return `${(amount / 1000).toFixed(0)}K`;
      }
    };

    return `₹${formatAmount(min)} - ₹${formatAmount(max)}`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getDaysUntilExpiry = (dateString?: string) => {
    if (!dateString) return null;
    const expiryDate = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays;
  };

  const daysUntilExpiry = getDaysUntilExpiry(job.expiresAt);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {job.title}
            </h3>
            <Badge variant={job.isActive ? 'success' : 'secondary'}>
              {job.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {job.location}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              {job.experienceMax
                ? `${job.experienceMin}-${job.experienceMax} years`
                : `${job.experienceMin}+ years`
              } • {job.jobType.replace('-', ' ')}
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="w-4 h-4 mr-2" />
              {formatSalary(job.salaryMin || 0, job.salaryMax || 0, job.currency || 'INR')}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              {applicationsCount} applications
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(job.id)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(job.id)}
            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 text-sm line-clamp-2">
          {job.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.slice(0, 4).map((skill) => (
          <Badge key={skill} variant="secondary" size="sm">
            {skill}
          </Badge>
        ))}
        {job.skills.length > 4 && (
          <Badge variant="secondary" size="sm">
            +{job.skills.length - 4} more
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span>Posted {getTimeAgo(job.postedAt)}</span>
        <span className={daysUntilExpiry !== null && daysUntilExpiry <= 7 ? 'text-red-500' : ''}>
          {daysUntilExpiry === null
            ? 'No expiry date'
            : daysUntilExpiry > 0
              ? `Expires in ${daysUntilExpiry} days`
              : 'Expired'
          }
        </span>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewApplications(job.id)}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Applications ({applicationsCount})
        </Button>

        <Button
          variant={job.isActive ? 'outline' : 'primary'}
          size="sm"
          onClick={() => onToggleStatus(job.id)}
        >
          {job.isActive ? 'Pause Job' : 'Activate Job'}
        </Button>
      </div>
    </Card>
  );
};
