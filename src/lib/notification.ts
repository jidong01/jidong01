import { supabase } from './supabase';

export const createNotification = async ({
  userId,
  actorId,
  type,
  postId,
  commentId,
  boardId,
  groupId,
}: {
  userId: string;
  actorId: string;
  type: string;
  postId?: string;
  commentId?: string;
  boardId?: string;
  groupId?: string;
}) => {
  try {
    if (userId === actorId) return;

    const { error } = await supabase.from('notifications').insert({
      user_id: userId,
      actor_id: actorId,
      type: type,
      post_id: postId,
      comment_id: commentId,
      board_id: boardId,
      group_id: groupId,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};