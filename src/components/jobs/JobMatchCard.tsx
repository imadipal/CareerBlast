import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Briefcase, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MatchPercentage } from '../matching/MatchPercentage';
import type { JobMatch } from '../../types';

interface JobMatchCardProps {
  jobMatch: JobMatch;
  onViewDetails?: () => void;
  onApply?: () => void;
  className?: string;
}

export const JobMatchCard: React.FC<JobMatchCardProps> = ({
  jobMatch,
  onViewDetails,
  onApply,
  className = ''
}) => {
  const { job, matchPercentage, matchExplanation, salaryMatches, experienceMatches } = jobMatch;

  const formatSalary = () => {
    // Only show public salary range to candidates (never show actualSalaryMin/Max)
    if (job.salaryMin && job.salaryMax) {
      return `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
    } else if (job.salaryMin) {
      return `${job.currency} ${job.salaryMin.toLocaleString()}+`;
    }
    return 'Salary not disclosed';
  };

  const formatExperience = () => {
    if (job.experienceMax) {
      return `${job.experienceMin}-${job.experienceMax} years`;
    }
    return `${job.experienceMin}+ years`;
  };

  const formatPostedDate = () => {
    const date = new Date(job.postedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <Card variant="interactive" className={`group relative overflow-hidden ${className}`}>
      {/* Match percentage badge */}
      <div className="absolute top-4 right-4 z-10">
        <MatchPercentage percentage={matchPercentage} size="sm" showLabel={false} />
      </div>

      {/* Gradient overlay for high matches */}
      {matchPercentage >= 85 && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      
      <div className="relative p-6">
        <div className="flex items-start space-x-4 mb-4">
          {/* Company logo */}
          <div className="flex-shrink-0">
            {job.company.logoUrl ? (
              <img
                src={job.company.logoUrl}
                alt={job.company.name}
                className="w-12 h-12 rounded-xl object-cover shadow-soft group-hover:shadow-md transition-shadow duration-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-soft">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          {/* Job details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  {job.company.name}
                </p>
              </div>
            </div>

            {/* Job metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                {job.jobType.replace('-', ' ')}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {formatExperience()} • {formatPostedDate()}
              </div>
            </div>

            {/* Salary */}
            <div className="flex items-center text-sm mb-3">
              <DollarSign className="w-4 h-4 mr-1 text-green-600" />
              <span className="font-medium text-gray-900">{formatSalary()}</span>
              {salaryMatches && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Salary Match
                </span>
              )}
            </div>

            {/* Match indicators */}
            <div className="flex items-center flex-wrap gap-2 mb-4">
              {salaryMatches && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Salary Match
                </span>
              )}
              {experienceMatches && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  ✓ Experience Match
                </span>
              )}
              {jobMatch.locationMatch && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  ✓ Location Match
                </span>
              )}
              <div className="flex items-center text-xs text-gray-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                {Math.round(matchPercentage)}% Match
              </div>
            </div>

            {/* Skills match summary */}
            {jobMatch.skillsMatch && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Skills Match</span>
                  <span>{Math.round(jobMatch.skillsMatch.percentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-brand-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${jobMatch.skillsMatch.percentage}%` }}
                  ></div>
                </div>
                {jobMatch.skillsMatch.matched.length > 0 && (
                  <p className="text-xs text-gray-600 mt-1">
                    Matched: {jobMatch.skillsMatch.matched.slice(0, 3).join(', ')}
                    {jobMatch.skillsMatch.matched.length > 3 && ` +${jobMatch.skillsMatch.matched.length - 3} more`}
                  </p>
                )}
              </div>
            )}

            {/* Match explanation */}
            {matchExplanation && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {matchExplanation}
              </p>
            )}

            {/* Job description preview */}
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {job.description}
            </p>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={onApply}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                Apply Now
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onViewDetails}
                className="flex-1 sm:flex-none"
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
