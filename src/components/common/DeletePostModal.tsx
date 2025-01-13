'use client';

import React from 'react';

interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

export function DeletePostModal({
  isOpen,
  onClose,
  onDelete,
  onCancel
}: DeletePostModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[5]">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-gray-800 bg-opacity-30"
        onClick={onClose}
      />
      
      {/* 모달 */}
      <div 
        className="
          relative
          flex
          flex-col
          w-[248px]
          h-[122px]
          bg-white
          rounded-2xl
        "
      >
        <div className="flex flex-col items-start px-4 pt-4 pb-2 gap-2 border-b border-gray-100">
          <h2 className="text-[13px] font-semibold text-gray-800">게시글 삭제</h2>
          <p className="text-[13px] font-medium text-gray-600">이 글을 완전히 삭제할까요?</p>
        </div>
        <div className="absolute bottom-0 w-full">
          <div className="flex w-full items-center justify-end">
            <button
              onClick={onCancel}
              className="
                w-[57px]
                h-[29px]
                px-4
                py-1
                text-[13px]
                font-semibold
                text-gray-500
              "
            >
              취소
            </button>
            <button
              onClick={onDelete}
              className="
                w-[57px]
                h-[29px]
                px-4
                py-1
                text-[13px]
                font-semibold
                text-gray-800
              "
            >
              삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 