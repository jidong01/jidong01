'use client';

import React from 'react';
import LikeOutlinedIcon from '@/assets/icons/like-outlined.svg';
import LikeFilledIcon from '@/assets/icons/like-filled.svg';

interface LikeButtonProps {
  isLiked: boolean;
  className?: string;
  onClick?: () => void;
}

export function LikeButton({ isLiked, className = '', onClick }: LikeButtonProps) {
  const Icon = isLiked ? LikeFilledIcon : LikeOutlinedIcon;

  return (
    <div className={className} onClick={onClick}>
      <Icon />
    </div>
  );
}