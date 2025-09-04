import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'interactive';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  variant = 'default',
  hover = false,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-soft',
    elevated: 'bg-white/90 backdrop-blur-sm border border-white/30 shadow-md',
    interactive: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-soft hover:shadow-xl hover:bg-white/90 hover:scale-105 cursor-pointer',
  };

  const hoverClasses = hover ? 'transition-all duration-300' : '';

  return (
    <div
      className={cn(
        'rounded-2xl',
        variantClasses[variant],
        paddingClasses[padding],
        hoverClasses,
        className
      )}
    >
      {children}
    </div>
  );
};
