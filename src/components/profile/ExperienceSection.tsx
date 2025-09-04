import React from 'react';
import { Briefcase, MapPin, Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import type { WorkExperience } from '../../types';
import { Card, Button } from '../ui';

interface ExperienceSectionProps {
  experiences: WorkExperience[];
  isOwnProfile?: boolean;
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  isOwnProfile = false,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const calculateDuration = (startDate: string, endDate?: string, isCurrent?: boolean) => {
    const start = new Date(startDate);
    const end = isCurrent ? new Date() : new Date(endDate!);
    const diffInMonths = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;
    
    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else if (months === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
    }
  };

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Briefcase className="w-5 h-5 mr-2" />
          Work Experience
        </h2>
        {isOwnProfile && (
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        )}
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No work experience added yet</p>
          {isOwnProfile && (
            <Button variant="outline" className="mt-4" onClick={onAdd}>
              Add your first experience
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((experience, index) => (
            <div key={experience.id} className={`${index !== experiences.length - 1 ? 'border-b border-gray-200 pb-6' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-gray-600" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {experience.position}
                      </h3>
                      <p className="text-primary-600 font-medium mb-2">
                        {experience.company}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center mb-1 sm:mb-0">
                          <MapPin className="w-4 h-4 mr-1" />
                          {experience.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(experience.startDate)} - {experience.isCurrent ? 'Present' : formatDate(experience.endDate!)}
                          <span className="ml-2 text-gray-500">
                            ({calculateDuration(experience.startDate, experience.endDate, experience.isCurrent)})
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">
                        {experience.description}
                      </p>
                    </div>
                  </div>
                </div>

                {isOwnProfile && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onEdit?.(experience.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete?.(experience.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
