'use client';

import { useState, useEffect } from 'react';
import { TopNavigation } from "@/components/common/TopNavigation";
import { PostFilter } from "@/components/common/PostFilter";
import { PostList } from "@/components/post/PostList";
import { CreatePostButton } from "@/components/common/CreatePostButton";
import { useBoards } from "@/hooks/useBoards";
import { useUser } from "@/hooks/useUser";

export default function MainPage() {
  const { user } = useUser();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'popular'>('all');
  const { currentGroupName, currentBoardName, selectedGroupId, selectedBoardId } = useBoards();

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!user) {
        window.location.href = '/login';
      }
    };
    
    checkAuth();
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

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