'use client';

import React from 'react';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg';
import ArrowRightIcon from '@/assets/icons/arrow-right.svg';
import NotificationIcon from '@/assets/icons/notification-gray.svg';
import MenuIcon from '@/assets/icons/menu.svg';
import CancelIcon from '@/assets/icons/cancel.svg';
import { CheckButton } from "@/components/common/CheckButton";

type NavigationType = 'main' | 'detail' | 'menu' | 'notification' | 'post-create' | 'signup';

interface TopNavigationProps {
  type: NavigationType;
  title: string;
  subtitle?: string;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  titleSize?: 'small' | 'large';
  isDisabled?: boolean;
}

export function TopNavigation({
  type,
  title,
  subtitle,
  onLeftClick,
  onRightClick,
  titleSize = 'small',
  isDisabled = false,
}: TopNavigationProps) {
  const leftSection = type !== 'menu' ? (
    type === 'post-create' ? (
      <button onClick={onLeftClick} className="flex items-center h-full">
        <CancelIcon />
      </button>
    ) : (
      <button onClick={onLeftClick} className="flex items-center justify-center h-full">
        {type === 'main' ? <MenuIcon /> : <ArrowLeftIcon />}
      </button>
    )
  ) : null;

  const rightSection = type !== 'notification' ? (
    type === 'post-create' ? (
      <div className="flex items-center h-full">
        <CheckButton 
          onClick={onRightClick}
          disabled={isDisabled}
        />
      </div>
    ) : (
      <button onClick={type === 'menu' ? onLeftClick : onRightClick} className="flex items-center justify-center h-full">
        {type === 'menu' ?(
          <ArrowRightIcon />
        ) : type !== 'signup' ? (
          <NotificationIcon />
        ) : null}
      </button>
    )
  ) : null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-[#E9EBED] z-50 max-w-[390px] mx-auto">
      <div className="relative flex items-center justify-between h-[52px] px-5">
        <div className="absolute left-5 h-full">{leftSection}</div>
        <div className="absolute right-5 h-full">{rightSection}</div>
        <div className="flex flex-col items-center w-full">
          <h1 className={`font-semibold text-[#1E1F1F] tracking-[-0.002em] ${
            titleSize === 'large' ? 'text-[18px]' : 'text-[12px]'
          }`}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-[12px] font-medium text-[#9FA4A8] tracking-[-0.002em]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}