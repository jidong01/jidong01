'use client';

import React from 'react';

interface CheckButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  disabled?: boolean;
}

export function CheckButton({ className = '', disabled = false, ...props }: CheckButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`
        flex
        flex-row
        justify-center
        items-center
        px-2
        py-1
        h-[25px]
        rounded-[28px]
        ${disabled 
          ? 'bg-[#E9EBED] cursor-not-allowed' 
          : 'bg-main'
        }
        ${className}
      `}
      {...props}
    >
      <span className={`
        text-[14px] 
        font-semibold 
        leading-[17px] 
        tracking-[-0.002em]
        ${disabled ? 'text-[#CBCDD3]' : 'text-white'}
      `}>
        완료
      </span>
    </button>
  );
} 