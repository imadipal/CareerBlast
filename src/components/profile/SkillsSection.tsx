import React from 'react';
import { Code, Plus, Edit } from 'lucide-react';
import type { Skill } from '../../types';
import { Card, Button, Badge } from '../ui';

interface SkillsSectionProps {
  skills: Skill[];
  isOwnProfile?: boolean;
  onAdd?: () => void;
  onEdit?: () => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  isOwnProfile = false,
  onAdd,
  onEdit,
}) => {
  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'success';
      case 'advanced':
        return 'primary';
      case 'intermediate':
        return 'warning';
      case 'beginner':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getSkillLevelText = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.level]) {
      acc[skill.level] = [];
    }
    acc[skill.level].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const skillLevels = ['expert', 'advanced', 'intermediate', 'beginner'];

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Code className="w-5 h-5 mr-2" />
          Skills
        </h2>
        {isOwnProfile && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Skills
            </Button>
            <Button variant="outline" size="sm" onClick={onAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>
        )}
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-8">
          <Code className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No skills added yet</p>
          {isOwnProfile && (
            <Button variant="outline" className="mt-4" onClick={onAdd}>
              Add your skills
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {skillLevels.map((level) => {
            const levelSkills = groupedSkills[level];
            if (!levelSkills || levelSkills.length === 0) return null;

            return (
              <div key={level}>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  {getSkillLevelText(level)} ({levelSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {levelSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <Badge variant={getSkillLevelColor(skill.level) as any} size="sm">
                        {skill.name}
                      </Badge>
                      {skill.yearsOfExperience && (
                        <span className="text-xs text-gray-500">
                          {skill.yearsOfExperience}y
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {skills.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {groupedSkills.expert?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Expert</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {groupedSkills.advanced?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Advanced</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {groupedSkills.intermediate?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Intermediate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {groupedSkills.beginner?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Beginner</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
