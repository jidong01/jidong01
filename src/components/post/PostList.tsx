import React from 'react';
import dynamic from 'next/dynamic';
import { usePosts } from '@/hooks/usePosts';
const Post = dynamic(() => import('./Post').then(mod => mod.Post), {
  ssr: false
});

interface PostListProps {
  className?: string;
}

export function PostList({ className = '' }: PostListProps) {
  const { posts } = usePosts();

  if (posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-[100px] text-gray-500">
        게시글이 없습니다.
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col w-full bg-gray-50 ${className}`}>
      {posts.map((post) => (
        <div key={post.id}>
          <div className="bg-white">
            <Post {...post} />
          </div>
          <div className="h-2 bg-gray-50" />
        </div>
      ))}
    </div>
  );
}