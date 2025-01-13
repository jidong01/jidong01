import React from 'react';
import { LikeButton } from '@/components/common/LikeButton';
import CommentMainIcon from '@/assets/icons/comment-main.svg';

interface PostFooterProps {
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  onLikeClick: () => void;
  className?: string;
}

export function PostFooter({
  likeCount,
  commentCount,
  isLiked,
  onLikeClick,
  className,
}: PostFooterProps) {
  return (
    <div className={`flex items-center gap-4 py-4 w-full ${className}`}>
      <div className="flex items-center gap-1">
        <LikeButton
          isLiked={isLiked}
          onClick={onLikeClick}
          className="text-gray-500"
        />
        <span className="text-sm text-gray-500">{likeCount}</span>
      </div>
      <div className="flex items-center gap-1">
        <CommentMainIcon className="w-[18px] h-[18px]" />
        <span className="text-[12px] text-gray-500">{commentCount}</span>
      </div>
    </div>
  );
}