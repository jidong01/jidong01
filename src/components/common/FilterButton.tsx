'use client';

import React from 'react';

interface FilterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  isSelected?: boolean;
}

export function FilterButton({ children, className = '', isSelected = false, ...props }: FilterButtonProps) {
  return (
    <button
      className={`
        flex
        justify-center
        items-center
        w-[56px]
        h-[22px]
        box-border
        border
        border-main
        rounded-2xl
        text-xs
        font-semibold
        tracking-[-0.2%]
        transition-colors
        duration-100
        ${isSelected 
          ? 'bg-main text-white' 
          : 'bg-white text-main'
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}