import React from 'react';
import EditIcon from '@/assets/icons/edit.svg';
import DeleteIcon from '@/assets/icons/delete.svg';

interface SettingModalProps {
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function SettingModal({ onEdit, onDelete, onClose }: SettingModalProps) {
  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* 모달 */}
      <div className="absolute right-0 top-4 w-[248px] flex flex-col bg-white shadow-[0px_0px_32px_rgba(0,0,0,0.15)] rounded-2xl z-50">
        <button
          onClick={onDelete}
          className="flex justify-between items-center px-4 py-3 border-b border-[#CBCDD3]"
        >
          <span className="text-[13px] font-medium text-[#26282B] leading-[160%] tracking-[-0.002em]">
            삭제하기
          </span>
          <DeleteIcon className="w-4 h-4 text-[#26282B]" />
        </button>
        <button
          onClick={onEdit}
          className="flex justify-between items-center px-4 py-3"
        >
          <span className="text-[13px] font-medium text-[#26282B] leading-[160%] tracking-[-0.002em]">
            수정하기
          </span>
          <EditIcon className="w-3.5 h-3.5 text-[#26282B]" />
        </button>
      </div>
    </>
  );
} 