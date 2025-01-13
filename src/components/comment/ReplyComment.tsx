import React, { useState } from 'react';
import Image from 'next/image';
import SettingIcon from '@/assets/icons/setting.svg';
import { SettingModal } from '@/components/comment/SettingModal';

interface ReplyCommentProps {
  author: string;
  content: string;
  createdAt: string;
  profileImage: string;
  isMyComment: boolean;
  onDelete: () => void;
  onEdit: () => void;
}

export function ReplyComment({
  author,
  content,
  createdAt,
  profileImage,
  isMyComment,
  onDelete,
  onEdit
}: ReplyCommentProps) {
  const [showSettingModal, setShowSettingModal] = useState(false);

  const handleDelete = () => {
    if (confirm('답글을 삭제하시겠습니까?')) {
      onDelete();
      setShowSettingModal(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-1 last:mb-0 border-l-2 border-gray-100 pl-4">
      <div className="relative">
        <div className="flex items-start gap-2">
          {/* 프로필 이미지 */}
          <div className="relative w-8 h-8">
            <Image
              src={profileImage || '/images/default-profile.png'}
              alt={author}
              fill
              className="rounded-full object-cover"
            />
          </div>

          {/* 답글 내용 */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-900">
                  {author}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(createdAt).toLocaleDateString()}
                </span>
              </div>
              {isMyComment && (
                <button onClick={() => setShowSettingModal(true)}>
                  <SettingIcon className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-900 break-words">
              {content}
            </p>
          </div>
        </div>
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
  );
}