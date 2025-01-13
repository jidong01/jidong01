'use client';

import React from 'react';

interface CreateBoardButtonProps {
  className?: string;
  onClick?: () => void;
}

export function CreateBoardButton({
  className = '',
  onClick = () => alert('게시판 만들기')
}: CreateBoardButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex
        flex-row
        justify-center
        items-center
        py-2
        w-[350px]
        h-[36px]
        bg-[#F52E46]
        rounded-[33px]
        gap-2
        hover:bg-[#d91b32]
        active:bg-[#bf1226]
        transition-colors
        ${className}
      `}
    >
      <span className="text-[15px] leading-[18px] font-medium text-white">
        게시판 만들기
      </span>
    </button>
  );
} 