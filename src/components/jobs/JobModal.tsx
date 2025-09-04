import React from 'react';
import { X, MapPin, Users, Calendar, Building, Clock, DollarSign } from 'lucide-react';
import ShareButton from '../common/ShareButton';
import type { Job } from '../../types';

interface JobModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

const JobModal: React.FC<JobModalProps> = ({ job, isOpen, onClose }) => {
  if (!isOpen || !job) return null;

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
        return 'More than 1000 employees';
      case 'SMALL':
        return '51-200 employees';
      case 'MEDIUM':
        return '201-1000 employees';
      case 'LARGE':
        return 'More than 1000 employees';
      default:
        return 'More than 1000 employees';
    }
  };

  const getCompanyLogo = (companyName: string) => {
    const initial = companyName.charAt(0).toUpperCase();
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500',
      'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ];
    const colorIndex = companyName.length % colors.length;

    return (
      <div className={`w-16 h-16 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-xl`}>
        {initial}
      </div>
    );
  };

  // Share functionality
  const jobUrl = `${window.location.origin}/jobs/${job.id}`;
  const shareText = `Check out this ${job.title} position at ${job.company?.name} in ${job.location}!`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getCompanyLogo(job.company?.name || 'Company')}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Member of Technical Staff - C#
              </h2>
              <p className="text-gray-600 font-medium">{job.company?.name}</p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{job.location}</span>
                <span className="mx-2">•</span>
                <span>{getExperienceText(job.experienceMin, job.experienceMax)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Share Button */}
            <ShareButton
              url={jobUrl}
              title={`${job.title} at ${job.company?.name}`}
              text={shareText}
              variant="button"
              size="md"
            />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Company Info */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {job.company?.name} at a glance
                </h3>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Founded in 2024</p>
                    <p className="text-sm text-gray-600">{formatCompanySize(job.company?.size)}</p>
                  </div>

                  <div className="flex justify-center space-x-4 text-gray-400">
                    <Building className="w-5 h-5" />
                    <Users className="w-5 h-5" />
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-100 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-2">Your Instamatch score</p>
                  <div className="flex items-center">
                    <div className="flex-1 bg-green-200 rounded-full h-2 mr-3">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-bold text-green-700">HIGH</span>
                  </div>
                  <p className="text-xs text-green-700 mt-2">
                    Your chances of being shortlisted for this job are high
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Job Details */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* About Company */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    About {job.company?.name}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {job.company?.name} is the digital work platform leader, trusted by thousands of organizations worldwide as the 
                    former VMware and Intel computing business.
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed mt-3">
                    We make digital work possible for their people. No painful IT processes or productivity 
                    trade-offs. Instead, a seamlessly delivered digital employee experience that simplifies work. Our 
                    comprehensive digital work platform enables IT teams to provide secure, personalized experiences 
                    for every employee on any device.
                  </p>
                </div>

                {/* Job Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Function:</span> Software Engineering • Backend Development
                      </p>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {job.description}
                      </p>
                    </div>

                    {/* Requirements */}
                    {job.requirements && job.requirements.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="text-gray-700 text-sm">{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Benefits */}
                    {job.benefits && job.benefits.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {job.benefits.map((benefit, index) => (
                            <li key={index} className="text-gray-700 text-sm">{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Meta Information */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{getExperienceText(job.experienceMin, job.experienceMax)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{job.jobType.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{job.applicationsCount} applicants</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-between">
          <button className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
            Not interested
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
