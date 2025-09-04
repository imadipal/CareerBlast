import React from 'react';
import { MapPin, Eye, Edit, Download, Share2 } from 'lucide-react';
import type { CandidateProfile } from '../../types';
import { Card, Button, Badge } from '../ui';

interface ProfileHeaderProps {
  profile: CandidateProfile;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isOwnProfile = false,
  onEdit,
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

  return (
    <Card className="mb-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="flex items-start space-x-4 mb-4 md:mb-0">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-600">
              {profile.userId.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              John Doe
            </h1>
            <p className="text-lg text-gray-700 mb-2">{profile.headline}</p>
            
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="w-4 h-4 mr-2" />
              {profile.location}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {profile.profileViews} profile views
              </div>
              <Badge variant={profile.isPublic ? 'success' : 'secondary'}>
                {profile.isPublic ? 'Public Profile' : 'Private Profile'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {isOwnProfile ? (
            <>
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </>
          ) : (
            <>
              <Button size="sm">
                Contact
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Experience</h3>
            <p className="text-lg font-semibold text-gray-900">
              {profile.experience.length > 0 
                ? `${profile.experience.reduce((total, exp) => {
                    const start = new Date(exp.startDate);
                    const end = exp.isCurrent ? new Date() : new Date(exp.endDate!);
                    const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
                    return total + years;
                  }, 0).toFixed(1)} years`
                : 'Fresher'
              }
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Salary Expectation</h3>
            <p className="text-lg font-semibold text-gray-900">
              {formatSalary(
                profile.preferences.salaryExpectation.min,
                profile.preferences.salaryExpectation.max,
                profile.preferences.salaryExpectation.currency
              )}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Preferred Locations</h3>
            <p className="text-lg font-semibold text-gray-900">
              {profile.preferences.locations.slice(0, 2).join(', ')}
              {profile.preferences.locations.length > 2 && ` +${profile.preferences.locations.length - 2} more`}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
