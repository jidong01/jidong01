'use client';

import React from 'react';
import Image from 'next/image';

const DEFAULT_PROFILE_IMAGE = '/images/default-profile.png';

interface ProfileSectionProps {
  className?: string;
  profileImage?: string | null | undefined;
  name: string;
  onLogout?: () => void;
}

export function ProfileSection({
  className = '',
  profileImage,
  name,
  onLogout = () => alert('로그아웃')
}: ProfileSectionProps) {
  const isValidImageUrl = profileImage && typeof profileImage === 'string' && profileImage.trim().length > 0;
  const imageUrl = isValidImageUrl ? profileImage.trim() : DEFAULT_PROFILE_IMAGE;

  return (
    <div
      className={`
        flex
        flex-row
        justify-between
        items-center
        w-full
        h-[68px]
        bg-white
        ${className}
      `}
    >
      {/* 프로필 정보 */}
      <div className="flex flex-row items-center gap-2">
        <div className="relative w-9 h-9 rounded-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={`${name}의 프로필 이미지`}
            fill
            className="object-cover"
            priority
          />
        </div>
        <span className="text-sm font-semibold text-gray-900">{name}</span>
      </div>
      
      {/* 로그아웃 버튼 */}
      <button
        onClick={onLogout}
        className="
          flex
          justify-center
          items-center
          px-3
          py-1
          w-[66px]
          h-[22px]
          bg-[#E9EBED]
          rounded-[16px]
          text-xs
          text-[#1A1A1A]
          hover:bg-[#DFE1E4]
          active:bg-[#D5D7DA]
          transition-colors
        "
      >
        로그아웃
      </button>
    </div>
  );
} 