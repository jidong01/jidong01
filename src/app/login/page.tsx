'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TextField } from '@/components/common/TextField';
import logo from '@/assets/images/logo.png';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // 추후 사용하면 좋을 코드

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        alert('이메일 또는 비밀번호가 올바르지 않습니다.');
        return;
      }

      if (data.user) {
        router.push('/');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col justify-between items-center gap-40 w-[390px] h-[739px] bg-white mx-auto">
      <div className="flex flex-col w-full">
        {/* 로고 이미지 */}
        <div className="flex justify-center items-center w-full">
          <Image
            src={logo}
            alt="로고"
            className="rounded-2xl"
          />
        </div>

        {/* 입력 폼 */}
        <div className="flex flex-col gap-10 w-full px-5">
          <div className="flex flex-col">
            <div className='flex flex-col gap-4'>
              <TextField
                label="이메일"
                value={email}
                onChange={setEmail}
                placeholder="korea@korea.ac.kr"
              />
              <TextField
                label="비밀번호"
                value={password}
                onChange={setPassword}
                placeholder="비밀번호"
                type="password"
              />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex flex-col gap-4">
            <button
              onClick={handleLogin}
              className="flex justify-center items-center py-2 w-full h-9 bg-[#F52E46] rounded-[33px]"
            >
              <span className="text-sm font-semibold leading-5 tracking-[-0.2px] text-white">
                로그인
              </span>
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="flex justify-center items-center py-2 w-full h-9 bg-gray-50 rounded-[33px]"
            >
              <span className="text-sm font-semibold leading-5 tracking-[-0.2px] text-gray-400">
                회원가입
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 