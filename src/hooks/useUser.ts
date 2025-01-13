import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

// 캐시된 사용자 정보를 저장할 전역 변수
let cachedUserProfile: { name: string | null; profileImage: string | null } | null = null;

export const useUser = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [name, setName] = useState<string | null>(cachedUserProfile?.name || null);
  const [profileImage, setProfileImageUrl] = useState<string | null>(cachedUserProfile?.profileImage || null);
  const [loading, setLoading] = useState(!cachedUserProfile);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async (user: SupabaseUser) => {
    try {
      // 캐시된 정보가 있으면 먼저 사용
      if (cachedUserProfile) {
        setName(cachedUserProfile.name);
        setProfileImageUrl(cachedUserProfile.profileImage);
      }

      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      
      if (profileData) {
        const newName = profileData.name || null;
        const newProfileImage = profileData.profile_image || null;
        
        // 캐시 업데이트
        cachedUserProfile = {
          name: newName,
          profileImage: newProfileImage
        };

        setName(newName);
        setProfileImageUrl(newProfileImage);
      }
    } catch (err) {
      console.error('사용자 프로필 로드 에러:', err);
      setError(err instanceof Error ? err.message : '사용자 정보를 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('세션 초기화 에러:', err);
        setError(err instanceof Error ? err.message : '사용자 정보를 불러오는데 실패했습니다.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.user);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setName(null);
        setProfileImageUrl(null);
        cachedUserProfile = null;  // 로그아웃 시 캐시 초기화
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    name,
    profileImage,
    loading,
    error,
    isAuthenticated: !!user,
  };
};