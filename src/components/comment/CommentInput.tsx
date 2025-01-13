'use client';

import React, { useState, useEffect } from 'react';
import { SendButton } from '@/components/common/SendButton';
import CameraIcon from '@/assets/icons/camera.svg';
import { usePosts } from '@/hooks/usePosts';

interface CommentInputProps {
  postId: string;
  editingComment?: {
    id: string;
    content: string;
    isReply?: boolean;
    commentId?: string;
  } | null;
  replyingTo?: {
    commentId: string;
    author: string;
  } | null;
  onEditComplete?: () => void;
  onReplyComplete?: () => void;
}

export function CommentInput({ 
  postId, 
  editingComment = null,
  replyingTo = null,
  onEditComplete,
  onReplyComplete 
}: CommentInputProps) {
  const [content, setContent] = useState('');
  const { addComment, editComment, editReply, addReply } = usePosts();

  useEffect(() => {
    if (editingComment) {
      setContent(editingComment.content);
    }
  }, [editingComment]);

  const handleSubmit = () => {
    if (!content.trim()) return;

    if (editingComment) {
      if (editingComment.isReply && editingComment.commentId) {
        editReply(postId, editingComment.commentId, editingComment.id, content);
      } else {
        editComment(postId, editingComment.id, content);
      }
      onEditComplete?.();
    } else if (replyingTo) {
      addReply(postId, replyingTo.commentId, content);
      onReplyComplete?.();
    } else {
      addComment(postId, content);
    }
    
    setContent('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  return (
    <div className="flex justify-center items-end p-2 gap-2 h-[55.42px] bg-[#F7F8F9]">
      <div className="relative flex items-center flex-1 h-[39.42px]">
        <div className="flex items-center flex-1 gap-1 px-4 py-2 bg-[#E9EBED] rounded-lg mr-[47px]">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              editingComment 
                ? "댓글 수정하기" 
                : replyingTo 
                  ? `${replyingTo.author}님에게 답글 쓰기`
                  : "댓글을 입력하세요"
            }
            className="flex-1 text-[13px] leading-[160%] bg-transparent outline-none text-[#26282B] font-medium"
          />
          <button className="flex items-center justify-end">
            <CameraIcon />
          </button>
        </div>
        <div className="absolute right-0">
          <SendButton onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}