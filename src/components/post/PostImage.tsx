import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface PostImageProps {
  images: string[];
  alt: string;
  isDetail?: boolean;
  postId?: string;
}

export function PostImage({ images, alt, isDetail = false, postId }: PostImageProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!isDetail && postId) {
      router.push(`/posts/${postId}`);
    }
  };

  return (
    <div 
      className={`w-full ${!isDetail && 'cursor-pointer'}`}
      onClick={handleClick}
    >
      <div className={`flex gap-2 pb-2 ${images.length === 1 ? 'justify-center' : 'overflow-x-auto scrollbar-hide'}`}>
        {images.map((imageUrl, index) => (
          <div 
            key={index}
            className="flex-shrink-0"
          >
            <Image
              src={imageUrl || '/images/default-image.png'}
              alt={`${alt} ${index + 1}`}
              width={350}
              height={330}
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
} 