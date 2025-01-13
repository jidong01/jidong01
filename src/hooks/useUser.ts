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
  const cached = localStorage.getItem('userProfile');
  if (!cached) return null;

  const profile = JSON.parse(cached) as UserProfile;
  if (Date.now() - profile.lastUpdated > CACHE_DURATION) {
    localStorage.removeItem('userProfile');
    return null;
  }

  return profile;
};

const setCachedProfile = (name: string | null, profileImage: string | null) => {
  const profile: UserProfile = {
    name,
    profileImage,
    lastUpdated: Date.now()
  };
  localStorage.setItem('userProfile', JSON.stringify(profile));
};

export const useUser = () => {
  const cachedProfile = getCachedProfile();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [name, setName] = useState<string | null>(cachedProfile?.name || null);
  const [profileImage, setProfileImageUrl] = useState<string | null>(cachedProfile?.profileImage || null);
  const [loading, setLoading] = useState(!cachedProfile);
  const [error, setError] = useState<string | null>(null);

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
          // 세션이 없으면 캐시 삭제
          localStorage.removeItem('userProfile');
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
        localStorage.removeItem('userProfile');
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