import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Notification } from '@/types/notification';
import { useUser } from '@/hooks/useUser';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          actor:actor_id(
            id,
            name,
            profile_image
          ),
          board:board_id(
            id,
            name
          ),
          board_group:group_id(
            id,
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedNotifications: Notification[] = (data || []).map(item => ({
        id: item.id,
        type: item.type,
        userId: item.user_id,
        actorId: item.actor_id,
        postId: item.post_id,
        actor: item.actor ? {
          id: item.actor.id,
          name: item.actor.name,
          profileImage: item.actor.profile_image
        } : {
          id: '',
          name: '알 수 없는 사용자',
          profileImage: '/images/default-profile.png'
        },
        board: item.board ? {
          id: item.board.id,
          name: item.board.name
        } : undefined,
        boardGroup: item.board_group ? {
          id: item.board_group.id,
          name: item.board_group.name
        } : undefined,
        isRead: item.is_read,
        createdAt: new Date(item.created_at)
      }));

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
      
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const subscribeToNotifications = useCallback(() => {
    if (!user) return;

    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          const [actorData, boardData, boardGroupData] = await Promise.all([
            supabase
              .from('users')
              .select('id, name, profile_image')
              .eq('id', payload.new.actor_id)
              .single(),
            supabase
              .from('boards')
              .select('id, name')
              .eq('id', payload.new.board_id)
              .single(),
            supabase
              .from('board_groups')
              .select('id, name')
              .eq('id', payload.new.board_group_id)
              .single()
          ]);

          if (actorData?.data && boardData?.data && boardGroupData?.data) {
            const notification: Notification = {
              id: payload.new.id,
              type: payload.new.type,
              userId: payload.new.user_id,
              actorId: payload.new.actor_id,
              postId: payload.new.post_id,
              actor: {
                id: actorData.data.id,
                name: actorData.data.name,
                profileImage: actorData.data.profile_image
              },
              board: {
                id: boardData.data.id,
                name: boardData.data.name
              },
              boardGroup: {
                id: boardGroupData.data.id,
                name: boardGroupData.data.name
              },
              isRead: payload.new.is_read,
              createdAt: new Date(payload.new.created_at)
            };
            setNotifications(prev => [notification, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const unsubscribe = subscribeToNotifications();
    return () => {
      unsubscribe?.();
    };
  }, [subscribeToNotifications]);

  return {
    notifications,
    loading,
    markAsRead,
    refetch: fetchNotifications,
  };
}; 