'use client';

import React from 'react';
import NotificationMainIcon from '@/assets/icons/notification-main.svg';

interface NotificationItemProps {
  className?: string;
  boardGroup: string;
  boardName: string;
  content: string;
  type: string;
  isRead?: boolean;
  onClick?: () => void;
}

export function NotificationItem({
  className = '',
  boardGroup,
  boardName,
  content,
  type,
  isRead = false,
  onClick
}: NotificationItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex
        flex-row
        items-center
        w-full
        min-h-[84px]
        px-5
        py-4
        bg-white
        hover:bg-gray-50
        active:bg-gray-100
        transition-colors
        border-b
        border-[#E9EBED]
        relative
        ${className}
      `}
    >
      {/* 알림 아이콘 */}
      <div className="w-6 h-full flex justify-center items-center flex-shrink-0">
        <NotificationMainIcon />
      </div>
      
      {/* 알림 내용 */}
      <div className="flex flex-col ml-2 text-left">
        <div className="h-3 flex items-center">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-semibold text-gray-400">{boardGroup}</span>
            <span className="text-[10px] font-semibold text-gray-400">{'>'}</span>
            <span className="text-[10px] font-semibold text-gray-400">{boardName}</span>
          </div>
        </div>
        <p className="text-[13px] font-medium text-black mt-2 text-left">{content}</p>
      </div>
    </button>
  );
}