'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopNavigation } from "@/components/common/TopNavigation";
import { PostFilter } from "@/components/common/PostFilter";
import { PostList } from "@/components/post/PostList";
import { CreatePostButton } from "@/components/common/CreatePostButton";
import { useBoards } from "@/hooks/useBoards";

export default function MainPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'popular'>('all');
  const { currentGroupName, currentBoardName, selectedGroupId, selectedBoardId, loading: boardsLoading } = useBoards();

  if (boardsLoading) return null;

  const handleCreatePost = () => {
    if (!selectedGroupId || !selectedBoardId) {
      alert('게시판을 선택해주세요.');
      return;
    }
    router.push('/posts/create');
  };

  const title = currentGroupName ? currentGroupName : '전체 게시판';

  return (
    <>
      <TopNavigation
        type="main"
        title={title}
        subtitle={currentBoardName || undefined}
        onLeftClick={() => router.push('/menu')}
        onRightClick={() => router.push('/notifications')}
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