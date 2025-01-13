import React, { useState } from 'react';
import { Post as PostType } from '@/types/post';
import { PostHeader } from './PostHeader';
import { PostContent } from './PostContent';
import { PostImage } from './PostImage';
import { PostFooter } from './PostFooter';
import { CommentList } from '@/components/comment/CommentList';
import { SettingModal } from '@/components/comment/SettingModal';
import SettingIcon from '@/assets/icons/setting.svg';
import { useRouter } from 'next/navigation';
import { usePosts } from '@/hooks/usePosts';
import { useUser } from '@/hooks/useUser';

interface PostProps extends Omit<PostType, 'boardId'> {
  className?: string;
  isDetail?: boolean;
  onEditStart?: (comment: {
    id: string;
    content: string;
    isReply?: boolean;
    commentId?: string;
  }) => void;
  onReplyStart?: (data: {
    commentId: string;
    author: string;
  }) => void;
} 

export const Post = React.memo(function Post({ 
  className = '', 
  id,
  title,
  content,
  author,
  images,
  likes: initialLikes,
  comments,
  createdAt,
  isDetail = false,
  onEditStart,
  onReplyStart,
}: PostProps) {
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const [likes, setLikes] = useState(initialLikes);
  const router = useRouter();
  const { likePost, deletePost } = usePosts();
  const { user } = useUser();
  
  const isMyPost = user && author.id === user.id;
  
  const handleLikeClick = () => {
    if (!user) return;
    
    // 즉시 UI 업데이트
    const isLiked = likes.likedUsers.some(likedUser => likedUser.id === user.id);
    setLikes({
      count: isLiked ? likes.count - 1 : likes.count + 1,
      likedUsers: isLiked
        ? likes.likedUsers.filter(likedUser => likedUser.id !== user.id)
        : [...likes.likedUsers, {
            id: user.id,
            name: user.user_metadata?.name || '',
            profile_image: user.user_metadata?.avatar_url || '/images/default-profile.png'
          }]
    });
    
    // DB 업데이트
    likePost(id);
  };
  
  const handleEdit = () => {
    router.push(`/posts/create?edit=true&postId=${id}`);
    setShowSettingModal(false);
  };
  
  const handleDelete = () => {
    if (confirm('게시글을 삭제하시겠습니까?')) {
      deletePost(id);
    }
  };
  
  return (
    <article className={`flex flex-col items-center pt-4 w-full ${className}`}>
      <div className="flex flex-col items-center px-5 gap-4 w-full">
        <div className="flex justify-between items-start w-full">
          <PostHeader
            profileImage={author.profile_image ?? ''}
            name={author.name}
            createdAt={createdAt}
          />
          {isMyPost && (
            <div className="relative">
              <button onClick={() => setShowSettingModal(true)}>
                <SettingIcon className="w-5 h-5 text-gray-500" />
              </button>
              {showSettingModal && (
                <SettingModal
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClose={() => setShowSettingModal(false)}
                />
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="w-full space-y-4">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-[200px] p-2 border border-gray-200 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-sm text-gray-500"
              >
                취소
              </button>
              <button
                onClick={handleEdit}
                className="px-3 py-1 text-sm text-blue-500"
              >
                저장
              </button>
            </div>
          </div>
        ) : (
          <>
            <PostContent
              title={title}
              content={content}
              isDetail={isDetail}
              postId={id}
            />
            {images?.length > 0 && (
              <PostImage
                images={images}
                alt={title}
                isDetail={isDetail}
                postId={id}
              />
            )}
          </>
        )}
      </div>
      <PostFooter
        likeCount={likes.count}
        commentCount={comments.length}
        isLiked={likes.likedUsers.some((likedUser) => likedUser.id === user?.id)}
        onLikeClick={handleLikeClick}
        className="px-5"
      />
      {isDetail && (
        <>
          <div className="h-[8px] w-full bg-gray-50" />
          <CommentList
            className="w-full px-5"
            postId={id}
            onEditStart={onEditStart}
            onReplyStart={onReplyStart}
          />
        </>
      )}
    </article>
  );
});