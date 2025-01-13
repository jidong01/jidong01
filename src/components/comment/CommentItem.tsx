'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CommentGrayIcon from '@/assets/icons/comment-gray.svg';
import SettingIcon from '@/assets/icons/setting.svg';
import { ReplyComment } from './ReplyComment';
import { SettingModal } from './SettingModal';

interface CommentItemProps {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
  isMyComment: boolean;
  profileImage: string;
  onDelete: () => void;
  onReplyClick: () => void;
  replies?: Array<{
    id: string;
    author: string;
    content: string;
    createdAt: string;
    profileImage: string;
    isMyComment: boolean;
    onDelete: () => void;
    onEdit: () => void;
  }>;
  onEdit: () => void;
}

export function CommentItem({
  id,
  postId,
  author,
  content,
  createdAt,
  isMyComment,
  profileImage,
  onReplyClick,
  onDelete,
  replies = [],
  onEdit
}: CommentItemProps) {
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  useEffect(() => {
    setEditContent(content);
  }, [content]);

  const handleEdit = () => {
    onEdit();
    setIsEditing(false);
    setShowSettingModal(false);
  };

  const handleDelete = () => {
    if (confirm('댓글을 삭제하시겠습니까?')) {
      onDelete();
      setShowSettingModal(false);
    }
  };

  return (
    <div className="flex flex-col w-full py-4 border-b border-gray-100">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={profileImage || '/images/default-profile.png'}
              alt={author}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-gray-900">{author}</span>
            <span className="text-[12px] text-gray-500">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="relative">
          {isMyComment && (
            <button onClick={() => setShowSettingModal(true)}>
              <SettingIcon className="w-5 h-5 text-gray-500" />
            </button>
          )}
          {showSettingModal && (
            <SettingModal
              onEdit={() => {
                setShowSettingModal(false);
                onEdit();
              }}
              onDelete={handleDelete}
              onClose={() => setShowSettingModal(false)}
            />
          )}
        </div>
      </div>
      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-lg"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
            >
              취소
            </button>
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-sm text-blue-500 hover:text-blue-700"
            >
              저장
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-[14px] text-gray-900">{content}</p>
      )}
      <div className="flex items-center gap-1 mt-2">
        <CommentGrayIcon />
        <button
          onClick={onReplyClick}
          className="text-[12px] text-gray-500 hover:text-gray-700"
        >
          답글달기
        </button>
      </div>
      
      {/* 답글 목록 */}
      {replies.length > 0 && (
        <div className="mt-4 flex flex-col gap-4">
          {replies.map((reply) => (
            <ReplyComment
              key={reply.id}
              author={reply.author}
              content={reply.content}
              createdAt={reply.createdAt}
              profileImage={reply.profileImage}
              isMyComment={reply.isMyComment}
              onDelete={reply.onDelete}
              onEdit={reply.onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}