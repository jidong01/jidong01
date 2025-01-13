'use client';

import React, { useState } from 'react';
import { TextField } from '@/components/common/TextField';
import { TopNavigation } from '@/components/common/TopNavigation';
import { supabase } from '@/lib/supabase';
import { isValidEmail, isValidPassword } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  // const [error, setError] = useState(''); 추후 사용하면 좋을 코드

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !name) {
      // setError('모든 필드를 입력해주세요.');
      alert('모든 필드를 입력해주세요.');
      return false;
    }

    if (!isValidEmail(email)) {
      // setError('올바른 이메일 형식이 아닙니다.');
      alert('올바른 이메일 형식이 아닙니다.');
      return false;
    }

    if (!isValidPassword(password)) {
      // setError('비밀번호는 영문, 숫자를 포함한 8자 이상이어야 합니다.');
      alert('비밀번호는 영문, 숫자를 포함한 8자 이상이어야 합니다.');
      return false;
    }

    if (password !== confirmPassword) {
      // setError('비밀번호가 일치하지 않습니다.');
      alert('비밀번호가 일치하지 않습니다.');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        if (authError.status === 429) {
          // setError('잠시 후 다시 시도해주세요.');
          return;
        }
        // setError('회원가입 중 오류가 발생했습니다.');
        alert('회원가입 중 오류가 발생했습니다.');
        return;
      }

      if (authData.user) {
        const { error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: email,
              name: name,
              profile_image_url: null,
            }
          ]);
        
        if (userError) {
          console.error('유저 정보 저장 에러:', userError);
          // setError('유저 정보 저장 중 오류가 발생했습니다.');
          alert('유저 정보 저장 중 오류가 발생했습니다.');
          return;
        }
        
        router.push('/');
      }
    } catch {
      // setError('회원가입 중 오류가 발생했습니다.');
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };
  
  return (
    <div className="flex flex-col justify-between items-center px-5 py-4 gap-4 w-[390px] h-[709px] bg-white mx-auto">
      <TopNavigation
        type="signup"
        title="회원가입"
        onLeftClick={() => router.push('/login')}
        titleSize="large"
      />
      
      <div className="flex flex-col mt-[52px] gap-4 w-[350px]">
        {/* 이메일 입력 */}
        <div>
          <TextField
            label="이메일"
            value={email}
            onChange={setEmail}
            placeholder="korea@korea.ac.kr"
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className="flex flex-col gap-2">
          <TextField
            label="비밀번호"
            value={password}
            onChange={setPassword}
            placeholder="비밀번호"
            type="password"
          />
          <p className="text-[11px] leading-4 tracking-[-0.2px] text-gray-400">
            영문, 숫자를 포함한 8자 이상의 비밀번호를 입력해주세요.
          </p>
        </div>

        {/* 비밀번호 확인 */}
        <TextField
          label="비밀번호 재확인"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="비밀번호"
          type="password"
        />

        {/* 닉네임 입력 */}
        <div className="flex flex-col gap-2">
          <TextField
            label="이름"
            value={name}
            onChange={setName}
            placeholder="안암동 호랑이"
          />
          <p className="text-[11px] leading-4 tracking-[-0.2px] text-gray-400">
            게시글을 쓸 때 표시되는 이름입니다.
          </p>
        </div>
      </div>

      {/* 회원가입 버튼 */}
      <button
        onClick={handleSignup}
        className="flex justify-center items-center py-2 w-[350px] h-9 bg-[#F52E46] rounded-[33px]"
      >
        <span className="text-sm font-semibold leading-5 tracking-[-0.2px] text-white">
          회원가입
        </span>
      </button>
    </div>
  );
} 