import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

export const useUser = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [profileImage, setProfileImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
        setName(profileData.name || null);
        setProfileImageUrl(profileData.profile_image_url || null);
      }
    } catch (err) {
      console.error('사용자 프로필 로드 에러:', err);
      setError(err instanceof Error ? err.message : '사용자 정보를 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user);
        }
      } catch (err) {
        console.error('세션 초기화 에러:', err);
        setError(err instanceof Error ? err.message : '사용자 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    initializeUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setName(null);
        setProfileImageUrl(null);
      }
    });

    return () => {
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