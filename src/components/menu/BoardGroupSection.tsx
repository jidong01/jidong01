'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useBoards } from '@/hooks/useBoards';
import { BoardGroup } from '@/types/board';

interface BoardGroupSectionProps {
  className?: string;
  boardGroup: BoardGroup;
}

export function BoardGroupSection({
  className = '',
  boardGroup
}: BoardGroupSectionProps) {
  const router = useRouter();
  const { selectGroup, selectBoard } = useBoards();
  
  const handleBoardClick = async (groupId: string, boardId: string) => {
    await Promise.all([
      selectGroup(groupId),
      selectBoard(boardId)
    ]);
    router.push('/');
  };

  return (
    <div
      className={`
        flex
        flex-col
        items-start
        w-full
        bg-white
        pt-5
        ${className}
      `}
    >
      {/* 게시판 그룹 제목 */}
      <h2 className="text-[14px] leading-[20px] font-bold text-gray-900 px-5">
        {boardGroup.name}
      </h2>

      {/* 게시판 리스트 */}
      <div className="flex flex-col w-full mt-4">
        {(boardGroup.boards || []).map((board) => (
          <button
            key={board.id}
            onClick={() => handleBoardClick(boardGroup.id, board.id)}
            className="
              flex
              items-center
              w-full
              h-8
              px-5
              text-[14px]
              leading-[18px]
              text-[#1A1A1A]
              hover:bg-gray-50
              active:bg-gray-100
              transition-colors
              text-left
            "
          >
            {board.name}
          </button>
        ))}
      </div>
      <div className="w-full px-5 mt-5">
        <div className="w-full border-b border-[#E9EBED]" />
      </div>
    </div>
  );
} 