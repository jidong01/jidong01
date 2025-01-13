'use client';

import React, { useEffect } from 'react';
import { TopNavigation } from '@/components/common/TopNavigation';
import { ProfileSection } from "@/components/menu/ProfileSection";
import { BoardGroupSection } from "@/components/menu/BoardGroupSection";
import { CreateBoardButton } from "@/components/menu/CreateBoardButton";
import { useBoards } from '@/hooks/useBoards';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabase';

export default function MenuPage() {
  const { boardGroups } = useBoards();
  const { name, profileImage, loading } = useUser();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        window.location.reload();
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [loading]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('로그아웃 중 오류가 발생했습니다:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <>
        <TopNavigation
          type="menu"
          title="메뉴"
          onLeftClick={() => window.history.back()}
          titleSize="large"
        />
        <div className="pt-[52px] w-full">
          <div className="bg-white px-5 py-4">
            <div className="animate-pulse h-20 bg-gray-200 rounded" />
            <div className="mt-4 flex justify-center">
              <div className="animate-pulse h-10 w-40 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="mt-2">
            <div className="animate-pulse h-40 bg-gray-200 rounded mx-4" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNavigation
        type="menu"
        title="메뉴"
        onLeftClick={() => window.history.back()}
        titleSize="large"
      />
      <div className="pt-[52px] w-full">
        <div className="bg-white px-5 py-4">
          <ProfileSection
            name={name || ''}
            profileImage={profileImage || ''}
            onLogout={handleLogout}
          />
          <div className="mt-4 flex justify-center">
            <CreateBoardButton
              onClick={() => {
                alert('서비스 준비 중입니다.');
              }}
            />
          </div>
        </div>
        <div className="mt-2">
          {boardGroups.map((group) => (
            <BoardGroupSection
              key={group.id}
              boardGroup={group}
            />
          ))}
        </div>
      </div>
    </>
  );
}