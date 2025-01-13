'use client';

import React from 'react';
import { FilterButton } from './FilterButton';

interface SubNavigationProps {
  className?: string;
  selectedFilter: 'all' | 'popular';
  onFilterChange: (filter: 'all' | 'popular') => void;
}

export function PostFilter({
  className = '',
  selectedFilter,
  onFilterChange
}: SubNavigationProps) {
  return (
    <div
      className={`
        flex
        flex-row
        items-center
        px-5
        py-3
        gap-2
        w-full
        max-w-[390px]
        h-[46px]
        bg-white
        ${className}
      `}
    >
      <FilterButton
        onClick={() => onFilterChange('all')}
        isSelected={selectedFilter === 'all'}
      >
        전체글
      </FilterButton>
      <FilterButton
        onClick={() => onFilterChange('popular')}
        isSelected={selectedFilter === 'popular'}
      >
        인기글
      </FilterButton>
    </div>
  );
} 