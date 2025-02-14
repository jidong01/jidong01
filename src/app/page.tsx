'use client';

import { useState, useEffect } from 'react';
import { TopNavigation } from "@/components/common/TopNavigation";
import { PostFilter } from "@/components/common/PostFilter";
import { PostList } from "@/components/post/PostList";
import { CreatePostButton } from "@/components/common/CreatePostButton";
import { useBoards } from "@/hooks/useBoards";
import { supabase } from '@/lib/supabase';

export default function MainPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'popular'>('all');
  const { currentGroupName, currentBoardName, selectedGroupId, selectedBoardId } = useBoards();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          window.location.href = '/login';
        } else {
          console.log('인증 확인 완료');
        }
      } catch (error) {
        console.error('인증 확인 중 오류 발생:', error);
        window.location.href = '/login';
      }
    };

    checkAuth();
  }, []);


  const handleCreatePost = () => {
    if (!selectedGroupId || !selectedBoardId) {
      alert('게시판을 선택해주세요.');
      return;
    }
    window.location.href = '/posts/create';
  };

  const title = currentGroupName ? currentGroupName : '전체 게시판';

  return (
    <>
      <TopNavigation
        type="main"
        title={title}
        subtitle={currentBoardName || undefined}
        onLeftClick={() => window.location.href = '/menu'}
        onRightClick={() => window.location.href = '/notifications'}
        titleSize={title === '전체 게시판' ? 'large' : 'small'}
      />
      <div className="pt-[52px] bg-gray-50">
        <PostFilter
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />
        <div className="h-[8px] bg-gray-50" />
        <PostList />
      </div>

      <CreatePostButton onClick={handleCreatePost} />
    </>
  );
}