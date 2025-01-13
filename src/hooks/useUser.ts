import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface UserProfile {
  name: string | null;
  profileImage: string | null;
  lastUpdated: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5분

const getCachedProfile = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem('userProfile');
    if (!cached) return null;

    const profile = JSON.parse(cached) as UserProfile;
    if (Date.now() - profile.lastUpdated > CACHE_DURATION) {
      localStorage.removeItem('userProfile');
      return null;
    }

    return profile;
  } catch (error) {
    console.error('캐시 읽기 오류:', error);
    return null;
  }
};

const setCachedProfile = (name: string | null, profileImage: string | null) => {
  if (typeof window === 'undefined') return;
  
  try {
    const profile: UserProfile = {
      name,
      profileImage,
      lastUpdated: Date.now()
    };
    localStorage.setItem('userProfile', JSON.stringify(profile));
  } catch (error) {
    console.error('캐시 저장 오류:', error);
  }
};

const clearCachedProfile = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('userProfile');
  } catch (error) {
    console.error('캐시 삭제 오류:', error);
  }
};

export const useUser = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [profileImage, setProfileImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 초기 마운트 시 캐시된 데이터 로드
  useEffect(() => {
    const cachedProfile = getCachedProfile();
    if (cachedProfile) {
      setName(cachedProfile.name);
      setProfileImageUrl(cachedProfile.profileImage);
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (user: SupabaseUser) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      
      if (profileData) {
        const newName = profileData.name || null;
        const newProfileImage = profileData.profile_image || null;
        
        setCachedProfile(newName, newProfileImage);
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
        } else {
          clearCachedProfile();
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
        clearCachedProfile();
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