'use client';

import React from 'react';
import { CommentItem } from './CommentItem';
import { Comment } from '@/types/post';
import { usePosts } from '@/hooks/usePosts';
import { useUser } from '@/hooks/useUser';

interface CommentListProps {
  className?: string;
  postId: string;
  onEditStart?: (comment: {
    id: string;
    content: string;
    isReply?: boolean;
    commentId?: string;
  }) => void;
  onReplyStart?: (data: { commentId: string; author: string }) => void;
}

export function CommentList({
  className = '',
  postId,
  onEditStart,
  onReplyStart
}: CommentListProps) {
  const { posts, deleteComment, deleteReply, editComment, editReply } = usePosts();
  const { user } = useUser();
  const post = posts.find(p => p.id === postId);
  const comments = post?.comments || [];
  
  if (comments.length === 0) {
    return (
      <div className="flex justify-center items-center h-[100px] text-gray-500">
        첫 번째 댓글을 작성해보세요.
      </div>
    );
  }

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {comments.map((comment: Comment) => (
        <CommentItem
          key={comment.id}
          id={comment.id}
          postId={postId}
          author={comment.user.name}
          content={comment.content}
          createdAt={comment.createdAt || ''}
          isMyComment={comment.user.id === user?.id}
          profileImage={comment.user.profile_image || ''}
          onDelete={() => deleteComment(postId, comment.id)}
          onEdit={() => onEditStart?.({
            id: comment.id,
            content: comment.content
          })}
          replies={comment.replies?.map(reply => ({
            id: reply.id,
            author: reply.user.name,
            content: reply.content,
            createdAt: reply.createdAt || '',
            profileImage: reply.user.profile_image || '',
            isMyComment: reply.user.id === user?.id,
            onDelete: () => deleteReply(postId, comment.id, reply.id),
            onEdit: () => onEditStart?.({
              id: reply.id,
              content: reply.content,
              isReply: true,
              commentId: comment.id
            })
          }))}
          onReplyClick={() => onReplyStart?.({
            commentId: comment.id,
            author: comment.user.name
          })}
        />
      ))}
    </div>
  );
}