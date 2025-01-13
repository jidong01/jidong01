import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function LoadingSpinner({ className = '', size = 'medium' }: LoadingSpinnerProps) {
  const sizeClass = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }[size];

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizeClass} animate-spin rounded-full border-4 border-gray-200 border-t-primary`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
} 