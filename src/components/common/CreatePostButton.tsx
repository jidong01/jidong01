'use client';

import React from 'react';
import CreatePostIcon from '@/assets/icons/create-post.svg';

interface CreatePostButtonProps {
  className?: string;
  onClick?: () => void;
}

export function CreatePostButton({
  className = '',
  onClick
}: CreatePostButtonProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full max-w-[390px] mx-auto pointer-events-none">
      <button
        onClick={onClick}
        className={`
          absolute 
          bottom-5
          right-5
          w-[52px] 
          h-[52px]
          bg-[#F52E46]
          rounded-full
          flex
          items-center
          justify-center
          shadow-lg
          pointer-events-auto
          ${className}
        `}
      >
        <CreatePostIcon />
      </button>
    </div>
  );
}