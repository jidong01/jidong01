'use client';

import { useParams } from 'next/navigation';
import { TopNavigation } from '@/components/common/TopNavigation';
import { Post } from '@/components/post/Post';
import { CommentInput } from '@/components/comment/CommentInput';
import { useState } from 'react';
import { useBoards } from '@/hooks/useBoards';
import { usePosts } from '@/hooks/usePosts';
import { useRouter } from 'next/navigation';

export default function PostDetailPage() {
  const router = useRouter();
  const { postId } = useParams();
  const { currentGroupName, currentBoardName, loading: boardsLoading } = useBoards();
  const { posts } = usePosts();
  const [editingComment, setEditingComment] = useState<{
    id: string;
    content: string;
    isReply?: boolean;
    commentId?: string;
  } | null>(null);
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    author: string;
  } | null>(null);
  
  const post = posts.find(p => p.id === postId);

  if (boardsLoading || !post) return null;

  return (
    <>
      <TopNavigation
        type="detail"
        title={currentGroupName || '전체 게시판'}
        subtitle={currentBoardName || undefined}
        onLeftClick={() => router.back()}
      />
      <div className="pt-[52px] pb-[60px]">
        <Post 
          {...post} 
          isDetail 
          onEditStart={setEditingComment}
          onReplyStart={setReplyingTo}
        />
      </div>
      <div className="fixed bottom-0 left-0 right-0 w-full max-w-[390px] mx-auto z-50">
        <CommentInput 
          postId={post.id} 
          editingComment={editingComment}
          replyingTo={replyingTo}
          onEditComplete={() => setEditingComment(null)}
          onReplyComplete={() => setReplyingTo(null)}
        />
      </div>
    </>
  );
}