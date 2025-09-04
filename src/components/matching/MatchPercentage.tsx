import React from 'react';

interface MatchPercentageProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const MatchPercentage: React.FC<MatchPercentageProps> = ({
  percentage,
  size = 'md',
  showLabel = true,
  className = ''
}) => {
  const getColorClass = (percent: number) => {
    if (percent >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (percent >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (percent >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (percent >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1 min-w-[3rem]';
      case 'lg':
        return 'text-lg px-4 py-2 min-w-[4rem]';
      default:
        return 'text-sm px-3 py-1.5 min-w-[3.5rem]';
    }
  };

  const getMatchLabel = (percent: number) => {
    if (percent >= 90) return 'Excellent Match';
    if (percent >= 80) return 'Great Match';
    if (percent >= 70) return 'Good Match';
    if (percent >= 60) return 'Fair Match';
    return 'Poor Match';
  };

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div className={`
        inline-flex items-center justify-center font-bold rounded-full border-2
        ${getColorClass(percentage)}
        ${getSizeClasses()}
      `}>
        {Math.round(percentage)}%
      </div>
      {showLabel && (
        <span className={`mt-1 text-xs text-gray-600 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          {getMatchLabel(percentage)}
        </span>
      )}
    </div>
  );
};
