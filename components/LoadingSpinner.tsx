import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'green' | 'white';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color = 'cyan' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const colorClasses = {
    cyan: 'border-neon-cyan',
    green: 'border-neon-green',
    white: 'border-white',
  };

  return (
    <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 ${colorClasses[color]}`}></div>
  );
};

export default LoadingSpinner;
