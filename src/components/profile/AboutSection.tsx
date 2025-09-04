import React from 'react';
import { User, Edit } from 'lucide-react';
import { Card, Button } from '../ui';

interface AboutSectionProps {
  summary: string;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  summary,
  isOwnProfile = false,
  onEdit,
}) => {
  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <User className="w-5 h-5 mr-2" />
          About
        </h2>
        {isOwnProfile && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      {summary ? (
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {summary}
        </p>
      ) : (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No summary added yet</p>
          {isOwnProfile && (
            <Button variant="outline" className="mt-4" onClick={onEdit}>
              Add your summary
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
