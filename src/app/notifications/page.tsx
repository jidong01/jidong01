'use client';

import React from 'react';
import { TopNavigation } from '@/components/common/TopNavigation';
import { NotificationItem } from "@/components/notification/NotificationItem";
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/types/notification';

export default function NotificationsPage() {
  const { notifications, loading } = useNotifications();

  const getNotificationMessage = (notification: Notification) => {
    const actorName = notification.actor.name || '알 수 없는 사용자';
    
    switch (notification.type) {
      case 'like':
        return `${actorName}님이 회원님의 게시글을 좋아합니다.`;
      case 'comment':
        return `${actorName}님이 회원님의 게시글에 댓글을 남겼습니다.`;
      case 'reply':
        return `${actorName}님이 회원님의 댓글에 답글을 남겼습니다.`;
      default:
        return '새로운 알림이 있습니다.';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center min-h-screen bg-[#F7F8F9]">
        <div className="w-full max-w-[390px] flex flex-col relative bg-[#F7F8F9]">
          <TopNavigation
            type="notification"
            title="알림"
            onLeftClick={() => window.history.back()}
            titleSize="large"
          />
          <div className="pt-[52px] w-full flex justify-center items-center">
            로딩 중...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen bg-[#F7F8F9]">
      <div className="w-full max-w-[390px] flex flex-col relative bg-[#F7F8F9]">
        <TopNavigation
          type="notification"
          title="알림"
          onLeftClick={() => window.history.back()}
          titleSize="large"
        />
        <div className="pt-[52px] w-full">
          {notifications.length === 0 ? (
            <div className="flex justify-center items-center h-[200px] text-gray-500">
              알림이 없습니다.
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                boardGroup={notification.boardGroup?.name || ''}
                boardName={notification.board?.name || ''}
                type={notification.type}
                content={getNotificationMessage(notification)}
                isRead={notification.isRead}
                onClick={() => {
                  window.location.href = `/posts/${notification.postId}`;
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
} 