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
        setProfileImageUrl(profileData.profile_image || null);
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