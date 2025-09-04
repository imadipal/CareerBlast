import React from 'react';
import { Card } from '../ui/Card';
import type { MatchBreakdown as MatchBreakdownType } from '../../types';

interface MatchBreakdownProps {
  breakdown: MatchBreakdownType;
  showExplanations?: boolean;
}

export const MatchBreakdown: React.FC<MatchBreakdownProps> = ({
  breakdown,
  showExplanations = false
}) => {
  const getBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const matchCategories = [
    {
      label: 'Skills',
      percentage: breakdown.skillsMatch,
      explanation: breakdown.skillsExplanation,
      icon: '🛠️'
    },
    {
      label: 'Experience',
      percentage: breakdown.experienceMatch,
      explanation: breakdown.experienceExplanation,
      icon: '💼'
    },
    {
      label: 'Education',
      percentage: breakdown.educationMatch ?? 0,
      explanation: breakdown.educationExplanation,
      icon: '🎓'
    },
    {
      label: 'Responsibilities',
      percentage: breakdown.responsibilitiesMatch ?? 0,
      explanation: breakdown.responsibilitiesExplanation,
      icon: '📋'
    },
    {
      label: 'Location',
      percentage: breakdown.locationMatch,
      explanation: 'Location compatibility assessment',
      icon: '📍'
    }
  ].filter(category => category.percentage !== undefined);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Match Breakdown</h3>
          <div className="text-3xl font-bold text-brand-600">
            {Math.round(breakdown.overallMatch)}%
          </div>
          <p className="text-sm text-gray-600 mt-1">Overall Match</p>
        </div>

        <div className="space-y-4">
          {matchCategories.map((category) => (
            <div key={category.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {category.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {Math.round(category.percentage)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getBarColor(category.percentage)}`}
                  style={{ width: `${Math.min(category.percentage, 100)}%` }}
                />
              </div>
              
              {showExplanations && category.explanation && (
                <p className="text-xs text-gray-600 mt-1">
                  {category.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        {showExplanations && breakdown.overallExplanation && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Overall Assessment
            </h4>
            <p className="text-sm text-gray-600">
              {breakdown.overallExplanation}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
