import React from 'react';
import { MapPin, DollarSign, Briefcase, Mail, User, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MatchPercentage } from '../matching/MatchPercentage';
import type { CandidateMatch } from '../../types';

interface CandidateMatchCardProps {
  candidate: CandidateMatch['candidate'];
  matchPercentage: number;
  matchExplanation?: string;
  expectedSalary: number;
  experienceYears: number;
  hasApplied: boolean;
  applicationStatus?: string;
  onViewProfile?: () => void;
  onContact?: () => void;
  className?: string;
}

export const CandidateMatchCard: React.FC<CandidateMatchCardProps> = ({
  candidate,
  matchPercentage,
  matchExplanation,
  expectedSalary,
  experienceYears,
  hasApplied,
  applicationStatus,
  onViewProfile,
  onContact,
  className = ''
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REVIEWING':
        return 'bg-blue-100 text-blue-800';
      case 'SHORTLISTED':
        return 'bg-purple-100 text-purple-800';
      case 'INTERVIEW_SCHEDULED':
        return 'bg-indigo-100 text-indigo-800';
      case 'INTERVIEWED':
        return 'bg-cyan-100 text-cyan-800';
      case 'OFFERED':
        return 'bg-green-100 text-green-800';
      case 'ACCEPTED':
        return 'bg-emerald-100 text-emerald-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'WITHDRAWN':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status?: string) => {
    if (!status) return '';
    return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card variant="interactive" className={`group relative overflow-hidden ${className}`}>
      {/* Match percentage badge */}
      <div className="absolute top-4 right-4 z-10">
        <MatchPercentage percentage={matchPercentage} size="sm" showLabel={false} />
      </div>

      {/* Applied indicator */}
      {hasApplied && (
        <div className="absolute top-4 left-4 z-10">
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Applied
          </div>
        </div>
      )}

      {/* Gradient overlay for high matches */}
      {matchPercentage >= 85 && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      
      <div className="relative p-6">
        <div className="flex items-start space-x-4">
          {/* Profile picture */}
          <div className="flex-shrink-0">
            {candidate.profilePictureUrl ? (
              <img
                src={candidate.profilePictureUrl}
                alt={`${candidate.firstName} ${candidate.lastName}`}
                className="w-12 h-12 rounded-full object-cover shadow-soft group-hover:shadow-md transition-shadow duration-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-soft">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          {/* Candidate details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                  {candidate.firstName} {candidate.lastName}
                </h3>
                <p className="text-sm text-gray-600">
                  {experienceYears} years experience
                </p>
              </div>
            </div>

            {/* Candidate metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
              {candidate.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {candidate.location}
                </div>
              )}
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Expected: ${expectedSalary.toLocaleString()}
              </div>
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                {experienceYears}+ years
              </div>
            </div>

            {/* Application status */}
            {hasApplied && applicationStatus && (
              <div className="mb-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(applicationStatus)}`}>
                  Status: {formatStatus(applicationStatus)}
                </span>
              </div>
            )}

            {/* Match explanation */}
            {matchExplanation && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                <span className="font-medium">Match Reason:</span> {matchExplanation}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={onViewProfile}
                size="sm"
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                View Profile
              </Button>
              <Button
                onClick={onContact}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
