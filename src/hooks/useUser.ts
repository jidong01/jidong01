import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

export const useUser = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [profileImage, setProfileImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async (user: SupabaseUser) => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setName(profileData?.name || null);
        setProfileImageUrl(profileData?.profile_image || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '사용자 정보를 불러오는데 실패했습니다.');
      }
    };

    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          await fetchUserProfile(user);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '사용자 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
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