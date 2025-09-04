import React from 'react';
import { GraduationCap, Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import type { Education } from '../../types';
import { Card, Button } from '../ui';

interface EducationSectionProps {
  education: Education[];
  isOwnProfile?: boolean;
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  education,
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

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <GraduationCap className="w-5 h-5 mr-2" />
          Education
        </h2>
        {isOwnProfile && (
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        )}
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8">
          <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No education details added yet</p>
          {isOwnProfile && (
            <Button variant="outline" className="mt-4" onClick={onAdd}>
              Add your education
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div key={edu.id} className={`${index !== education.length - 1 ? 'border-b border-gray-200 pb-6' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-gray-600" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {edu.degree}
                      </h3>
                      <p className="text-primary-600 font-medium mb-1">
                        {edu.institution}
                      </p>
                      <p className="text-gray-600 mb-2">
                        {edu.field}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center mb-1 sm:mb-0">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate!)}
                        </div>
                        {edu.grade && (
                          <div className="text-gray-700 font-medium">
                            Grade: {edu.grade}
                          </div>
                        )}
                      </div>
                      
                      {edu.description && (
                        <p className="text-gray-700 leading-relaxed">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {isOwnProfile && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onEdit?.(edu.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete?.(edu.id)}
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
