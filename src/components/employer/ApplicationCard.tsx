import React from 'react';
import { MapPin, Download, Mail, Eye } from 'lucide-react';
import type { JobApplication } from '../../types';
import { Card, Badge, Button, Select } from '../ui';

interface ApplicationCardProps {
  application: JobApplication;
  candidate: {
    id: string;
    name: string;
    email: string;
    location: string;
    experience: string;
    skills: string[];
    avatar: string;
  };
  onStatusChange: (applicationId: string, status: JobApplication['status']) => void;
  onViewProfile: (candidateId: string) => void;
  onDownloadResume: (resumeUrl: string) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  candidate,
  onStatusChange,
  onViewProfile,
  onDownloadResume,
}) => {
  const getStatusColor = (status: JobApplication['status']) => {
    switch (status) {
      case 'applied':
        return 'secondary';
      case 'reviewed':
        return 'info';
      case 'shortlisted':
        return 'warning';
      case 'interviewed':
        return 'primary';
      case 'hired':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: JobApplication['status']) => {
    switch (status) {
      case 'applied':
        return 'Applied';
      case 'reviewed':
        return 'Reviewed';
      case 'shortlisted':
        return 'Shortlisted';
      case 'interviewed':
        return 'Interviewed';
      case 'hired':
        return 'Hired';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const statusOptions = [
    { value: 'applied', label: 'Applied' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interviewed', label: 'Interviewed' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' },
  ];

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

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <img
            src={candidate.avatar}
            alt={candidate.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {candidate.name}
            </h3>
            <p className="text-gray-600">{candidate.email}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {candidate.location}
              <span className="mx-2">•</span>
              {candidate.experience}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusColor(application.status) as any}>
            {getStatusText(application.status)}
          </Badge>
          <span className="text-xs text-gray-500">
            {getTimeAgo(application.appliedAt)}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((skill) => (
            <Badge key={skill} variant="secondary" size="sm">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {application.coverLetter && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h4>
          <p className="text-sm text-gray-600 line-clamp-3">
            {application.coverLetter}
          </p>
        </div>
      )}

      {application.notes && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
          <p className="text-sm text-gray-600">
            {application.notes}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewProfile(candidate.id)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Profile
          </Button>
          
          {application.resumeUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownloadResume(application.resumeUrl!)}
            >
              <Download className="w-4 h-4 mr-2" />
              Resume
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`mailto:${candidate.email}`)}
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Select
            options={statusOptions}
            value={application.status}
            onChange={(e) => onStatusChange(application.id, e.target.value as JobApplication['status'])}
            className="w-32"
          />
        </div>
      </div>
    </Card>
  );
};
