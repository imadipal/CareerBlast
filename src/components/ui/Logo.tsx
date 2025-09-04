import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className = '', 
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-3 group ${className}`}>
      {/* Logo SVG */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <svg 
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
        >
          {/* Background Circle with Gradient */}
          <circle cx="32" cy="32" r="32" fill="url(#gradient)" />
          
          {/* Briefcase Icon */}
          <g transform="translate(16, 16)">
            {/* Main briefcase body */}
            <rect x="4" y="12" width="24" height="16" rx="2" fill="white" opacity="0.95"/>
            
            {/* Briefcase handle */}
            <rect x="12" y="8" width="8" height="4" rx="1" fill="white" opacity="0.8"/>
            
            {/* Briefcase lock */}
            <rect x="14" y="18" width="4" height="3" rx="0.5" fill="#0284c7"/>
            
            {/* Arrow pointing up (representing growth/next opportunity) */}
            <path 
              d="M16 6 L20 2 L24 6" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none" 
              opacity="0.9"
            />
          </g>
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:'#0ea5e9', stopOpacity:1}} />
              <stop offset="50%" style={{stopColor:'#0284c7', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#0369a1', stopOpacity:1}} />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Company Name */}
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent`}>
          MyNexJob
        </span>
      )}
    </div>
  );
};
