'use client';

import React from 'react';
import ArrowUpIcon from '@/assets/icons/arrow-up.svg';

interface SendButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
}

export function SendButton({ children, className = '', ...props }: SendButtonProps) {
  return (
    <button
      className={`
        w-[39px]
        h-[39px]
        rounded-full
        bg-main
        flex
        items-center
        justify-center
        active:bg-gray-400
        transition-colors
        duration-200
        ${className}
      `}
      {...props}
    >
      {children || <ArrowUpIcon className="w-6 h-6 text-white" />}
    </button>
  );
}