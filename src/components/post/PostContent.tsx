import React from 'react';
import { useRouter } from 'next/navigation';

interface PostContentProps {
  title: string;
  content: string;
  isDetail?: boolean;
  postId?: string;
}

export function PostContent({ title, content, isDetail = false, postId }: PostContentProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!isDetail && postId) {
      router.push(`/posts/${postId}`);
    }
  };

  return (
    <div 
      className={`flex flex-col gap-2 w-full ${!isDetail && 'cursor-pointer'}`}
      onClick={handleClick}
    >
      <h2 className="font-semibold text-base">{title}</h2>
      <p className={`text-sm text-gray-600 ${!isDetail && "line-clamp-2"}`}>
        {content}
      </p>
    </div>
  );
} 