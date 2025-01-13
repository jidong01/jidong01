'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { TopNavigation } from "@/components/common/TopNavigation";
import ImageDeleteIcon from '@/assets/icons/image-delete.svg';
import CameraGrayIcon from '@/assets/icons/camera-gray.svg';
import { useBoards } from '@/hooks/useBoards';
import { usePosts } from '@/hooks/usePosts';

interface AttachedImage {
  id: string;
  url: string;
  file?: File;
}

export default function CreatePostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { boardGroups, selectedGroupId, selectedBoardId, currentGroupName, currentBoardName } = useBoards();
  const { editPost, addPost } = usePosts();

  const isEditMode = searchParams.get('edit') === 'true';
  const postId = searchParams.get('postId');

  // 수정할 게시글 찾기
  const editingPost = useMemo(() => {
    if (!isEditMode || !postId || !boardGroups.length) return null;

    return boardGroups
      .flatMap(group => group.boards)
      .flatMap(board => board.posts)
      .find(p => p.id === postId);
  }, [isEditMode, postId, boardGroups]);

  // 기존 게시글 내용으로 초기화
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([]);

  // boardGroups가 로드되면 게시글 내용 설정
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
      setAttachedImages(
        editingPost.images.map((url, index) => ({
          id: `existing-${index}`,
          url
        }))
      );
    }
  }, [editingPost]);

  const boardTitle = isEditMode ? '게시글 수정' : '글쓰기';
  const boardSubtitle = '';

  const isFormEmpty = !title.trim() || !content.trim();

  const handleSubmit = async () => {
    if (isFormEmpty) return;

    try {
      if (isEditMode && postId && editingPost) {
        // 수정 모드
        await editPost(postId, {
          title: title.trim(),
          content: content.trim()
        });
        router.back();
      } else {
        // 새 게시글 작성
        if (!selectedGroupId || !selectedBoardId) {
          alert('게시판을 선택해주세요.');
          return;
        }

        const newPost = {
          boardId: selectedBoardId,
          boardGroupId: selectedGroupId,
          boardGroup: {
            id: selectedGroupId,
            name: currentGroupName || ''
          },
          title: title.trim(),
          content: content.trim(),
          author: {
            id: '1',
            name: '임시 사용자',
            profile_image: '/images/default-profile.png'
          },
          images: [],
          likes: {
            count: 0,
            likedUsers: []
          },
          comments: []
        };

        // 이미지 파일 배열 생성 - 저장된 File 객체 직접 사용
        const files = attachedImages
          .filter(img => img.file)
          .map(img => img.file!);

        await addPost(selectedBoardId, newPost, files);
        router.push('/');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  const handleDeleteImage = (id: string) => {
    setAttachedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: AttachedImage[] = Array.from(files).map(file => ({
      id: `temp-${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file: file
    }));

    setAttachedImages(prev => [...newImages, ...prev]);
  };

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <div className="w-full max-w-[390px] flex flex-col relative">
        <TopNavigation
          type="post-create"
          title={boardTitle}
          subtitle={boardSubtitle}
          onLeftClick={handleCancel}
          onRightClick={handleSubmit}
          titleSize="small"
          isDisabled={isFormEmpty}
        />
        <div className="pt-[52px] px-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center py-4 border-b border-[#E9EBED]">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
                className="w-full text-[14px] font-medium text-black placeholder-gray-400 outline-none leading-[17px] tracking-[-0.002em]"
              />
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="멋진 내용을 공유해보세요!"
              className="w-full h-[calc(100vh-400px)] text-[14px] font-normal text-[#26282B] placeholder-gray-400 outline-none resize-none leading-[160%] tracking-[-0.002em]"
            />
            
            {/* 사진 첨부 컴포넌트 */}
            <div className="absolute bottom-0 left-0 right-0 flex flex-col items-start px-5 h-[51.42px] bg-white">
              <div className="flex justify-end items-center w-full h-[51.42px] border-t border-[#E9EBED]">
                <label className="flex items-center justify-center p-[2px] bg-white cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <CameraGrayIcon />
                </label>
              </div>
            </div>

            {/* 이미지 미리보기 영역 */}
            {attachedImages.length > 0 && (
              <div className="flex flex-row items-center py-4 gap-5 overflow-x-auto scrollbar-hide">
                {attachedImages.map((image) => (
                  <div 
                    key={image.id} 
                    className="relative flex-shrink-0 w-[164.02px] h-[153.71px] rounded-[3.75px] overflow-hidden"
                  >
                    <Image
                      src={image.url}
                      alt="첨부 이미지"
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="absolute right-[5.62px] top-[5.62px] w-[18.75px] h-[18.75px] flex items-center justify-center"
                    >
                      <ImageDeleteIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}