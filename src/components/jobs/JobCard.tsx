import React, { useState } from 'react';
import { MapPin, Users, Calendar, Eye, Share2 } from 'lucide-react';
import type { Job } from '../../types';

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
  className?: string;
}

const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails, className = '' }) => {
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not disclosed';
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    if (min) return `₹${min.toLocaleString()}+`;
    return `Up to ₹${max?.toLocaleString()}`;
  };

  const getExperienceText = (min?: number, max?: number) => {
    if (!min && !max) return 'Any experience';
    if (min && max) return `${min} - ${max} years`;
    if (min) return `${min}+ years`;
    return `Up to ${max} years`;
  };

  const formatCompanySize = (size?: string) => {
    switch (size) {
      case 'STARTUP':
        return '1-50 employees';
      case 'SMALL':
        return '51-200 employees';
      case 'MEDIUM':
        return '201-1000 employees';
      case 'LARGE':
        return 'More than 1000 employees';
      default:
        return 'Company size not specified';
    }
  };

  const getCompanyLogo = (companyName: string) => {
    // Generate a simple colored circle with company initial
    const initial = companyName.charAt(0).toUpperCase();
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500',
      'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ];
    const colorIndex = companyName.length % colors.length;

    return (
      <div className={`w-12 h-12 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-lg`}>
        {initial}
      </div>
    );
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const jobUrl = `${window.location.origin}/jobs/${job.id}`;
    const shareText = `Check out this ${job.title} position at ${job.company?.name} in ${job.location}!`;

    if (navigator.share) {
      // Use native share API if available
      navigator.share({
        title: `${job.title} at ${job.company?.name}`,
        text: shareText,
        url: jobUrl,
      }).catch(console.error);
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${shareText} ${jobUrl}`).then(() => {
        setShowShareTooltip(true);
        setTimeout(() => setShowShareTooltip(false), 2000);
      }).catch(console.error);
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            {getCompanyLogo(job.company?.name || 'Company')}
          </div>

          {/* Job Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {job.company?.name} - {job.title}
                </h3>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Job available in {job.location}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Users className="w-4 h-4 mr-1" />
                  <span>Founded in 2024 • {formatCompanySize(job.company?.size)}</span>
                </div>

                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {job.description}
                </p>

                {/* Skills/Technologies */}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 6).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 6 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        +{job.skills.length - 6} more
                      </span>
                    )}
                  </div>
                )}

                {/* Job Meta Info */}
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{getExperienceText(job.experienceMin, job.experienceMax)}</span>
                  </div>
                  <div>
                    <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-end space-y-2 ml-4">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <button
                      onClick={handleShare}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Share this job"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {/* Share Tooltip */}
                    {showShareTooltip && (
                      <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                        Link copied!
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onViewDetails(job)}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                </div>

                <button className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
                  Not interested
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
