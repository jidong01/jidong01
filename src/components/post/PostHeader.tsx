import React from 'react';
import Image from 'next/image';
import { formatDate } from '@/utils/dateFormat';

interface PostHeaderProps {
  profileImage: string;
  name: string;
  createdAt: string;
}

export function PostHeader({ profileImage, name, createdAt }: PostHeaderProps) {
  return (
    <div className="flex items-center gap-2 w-full">
      <Image
        src={profileImage || '/images/default-profile.png'}
        alt={name}
        width={36}
        height={36}
        className="rounded-full"
      />
      <div>
        <div className="font-semibold">{name}</div>
        <div className="text-sm text-gray-500">
          {formatDate(createdAt)}
        </div>
      </div>
    </div>
  );
} 