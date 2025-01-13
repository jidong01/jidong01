'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Post, PostFilter } from '@/types/post';
import { useBoards } from '@/hooks/useBoards';
import { createNotification } from '@/lib/notification';

interface CommentData {
  id: string;
  content: string;
  created_at: string;
  parent_id: string | null;
  users: {
    id: string;
    name: string;
    profile_image: string | null;
  };
}

interface CommentResponse {
  id: string;
  content: string;
  created_at: string;
  users: {
    id: string;
    name: string;
    profile_image: string | null;
  };
}

interface RealtimeCommentResponse {
  id: string;
  content: string;
  post_id: string;
  parent_id: string | null;
  created_at: string;
  users: {
    id: string;
    name: string;
    profile_image: string | null;
  };
}

export const usePosts = () => {
  const { selectedGroupId, selectedBoardId } = useBoards();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<PostFilter>({ type: 'all' });

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      
      if (!selectedBoardId && !selectedGroupId) {
        setPosts([]);
        return;
      }

      let query = supabase
        .from('posts')
        .select(`
          *,
          boards!board_id(
            *,
            board_groups(*)
          ),
          users!author_id(
            id,
            name,
            profile_image
          ),
          comments(
            id,
            content,
            created_at,
            author_id,
            parent_id,
            users!author_id(
              id,
              name,
              profile_image
            )
          ),
          likes(
            id,
            users(
              id,
              name,
              profile_image
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (selectedBoardId) {
        query = query.eq('board_id', selectedBoardId);
      }
      else if (selectedGroupId) {
        const { data: boardIds } = await supabase
          .from('boards')
          .select('id')
          .eq('group_id', selectedGroupId);
        
        if (boardIds && boardIds.length > 0) {
          query = query.in('board_id', boardIds.map(b => b.id));
        } else {
          setPosts([]);
          return;
        }
      }
      
      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      
      const formattedPosts = data?.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        boardId: post.board_id,
        boardGroupId: post.boards.board_group_id,
        boardGroup: {
          id: post.boards.board_groups.id,
          name: post.boards.board_groups.name
        },
        images: post.images || [],
        author: {
          id: post.users.id,
          name: post.users.name,
          profile_image: post.users.profile_image || '/images/default-profile.png',
        },
        likes: {
          count: post.likes?.length || 0,
          likedUsers: post.likes?.map((like: { users: { id: string; name: string; profile_image_url: string | null } }) => ({
            id: like.users.id,
            name: like.users.name,
            profile_image: like.users.profile_image_url || '/images/default-profile.png',
          })) || [],
        },
        comments: post.comments
          ?.filter((comment: CommentData) => !comment.parent_id)
          ?.map((comment: CommentData) => ({
            id: comment.id,
            content: comment.content,
            user: {
              id: comment.users.id,
              name: comment.users.name,
              profile_image: comment.users.profile_image || '/images/default-profile.png',
            },
            createdAt: comment.created_at,
            replies: post.comments
              ?.filter((reply: CommentData) => reply.parent_id === comment.id)
              ?.map((reply: CommentData) => ({
                id: reply.id,
                content: reply.content,
                user: {
                  id: reply.users.id,
                  name: reply.users.name,
                  profile_image: reply.users.profile_image || '/images/default-profile.png',
                },
                createdAt: reply.created_at,
              })) || [],
          })) || [],
        createdAt: post.created_at,
      })) || [];
      
      setPosts(formattedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : '게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [selectedBoardId, selectedGroupId, filter.type]);

  const uploadImages = async (files: File[]) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('로그인이 필요합니다.');

      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `${userData.user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(filePath);
        console.log(publicUrl);
        return publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (err) {
      console.error('Error uploading images:', err);
      throw new Error('이미지 업로드에 실패했습니다.');
    }
  };

  const addPost = useCallback(async (boardId: string, post: Omit<Post, 'id' | 'createdAt'>, imageFiles?: File[]) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('로그인이 필요합니다.');

      let imageUrls: string[] = [];

      if (imageFiles && imageFiles.length > 0) {
        try {
          imageUrls = await uploadImages(imageFiles);
        } catch (error) {
          console.error('Image upload error:', error);
          throw new Error('이미지 업로드에 실패했습니다.');
        }
      }

      const { error } = await supabase
        .from('posts')
        .insert({
          board_id: boardId,
          board_group_id: post.boardGroupId,
          title: post.title,
          content: post.content,
          author_id: userData.user.id,
          images: imageUrls,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        if (imageUrls.length > 0) {
          try {
            const paths = imageUrls.map(url => url.split('/').pop()!);
            await Promise.all(
              paths.map(path => 
                supabase.storage
                  .from('posts')
                  .remove([`${userData.user!.id}/${path}`])
              )
            );
          } catch (cleanupError) {
            console.error('Failed to cleanup images:', cleanupError);
          }
        }
        throw error;
      }

      await fetchPosts();
    } catch (err) {
      console.error('Error adding post:', err);
      setError(err instanceof Error ? err.message : '게시글 작성에 실패했습니다.');
      throw err; // 에러를 상위로 전파하여 UI에서 처리할 수 있도록 함
    }
  }, [fetchPosts]);

  const editPost = useCallback(async (postId: string, updates: { title: string; content: string }) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', postId);

      if (error) throw error;
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '게시글 수정에 실패했습니다.');
    }
  }, [fetchPosts]);

  const deletePost = useCallback(async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '게시글 삭제에 실패했습니다.');
    }
  }, [fetchPosts]);

  const likePost = useCallback(async (postId: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('로그인이 필요합니다.');

      const currentPost = posts.find(post => post.id === postId);
      if (!currentPost) return;

      const isLiked = currentPost.likes.likedUsers.some(user => user.id === userData.user!.id);

      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id !== postId) return post;
            return {
              ...post,
              likes: {
                count: isLiked ? post.likes.count - 1 : post.likes.count + 1,
                likedUsers: isLiked
              ? post.likes.likedUsers.filter(user => user.id !== userData.user!.id)
                  : [...post.likes.likedUsers, {
                  id: userData.user.id,
                  name: userData.user.user_metadata?.name || '',
                  profile_image: userData.user.user_metadata?.avatar_url || '/images/default-profile.png'
                    }]
              }
            };
      }));

      if (isLiked) {
        const { data: existingLike } = await supabase
          .from('likes')
          .select('id, post_id, user_id')
          .eq('post_id', postId)
          .eq('user_id', userData.user.id)
          .single();

        if (existingLike) {
          await supabase
            .from('likes')
            .delete()
            .eq('id', existingLike.id);
        }
      } else {
        await supabase
          .from('likes')
          .insert({
            post_id: postId,
            user_id: userData.user.id,
            created_at: new Date().toISOString()
          });

        const { data: postData } = await supabase
          .from('posts')
          .select(`
            *,
            boards!board_id(
              group_id
            )
          `)
          .eq('id', postId)
          .single();

        if (postData) {
          await createNotification({
            userId: postData.author_id,
            actorId: userData.user.id,
            type: 'like',
            postId,
            boardId: postData.board_id,
            groupId: postData.boards.group_id,
          });
        }
      }
    } catch (err) {
      await fetchPosts();
      setError(err instanceof Error ? err.message : '좋아요 처리에 실패했습니다.');
    }
  }, [posts, fetchPosts]);

  const addComment = useCallback(async (postId: string, content: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('로그인이 필요합니다.');

      const tempComment = {
        id: 'temp-' + Date.now(),
        content,
        user: {
          id: userData.user.id,
          name: userData.user.user_metadata?.name || '',
          profile_image: userData.user.user_metadata?.avatar_url || '/images/default-profile.png',
        },
        createdAt: new Date().toISOString(),
        replies: []
      };

      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: [...post.comments, tempComment]
        };
      }));

      const { data: newComment, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_id: userData.user.id,
          content: content,
          created_at: new Date().toISOString()
        })
        .select(`
          id,
          content,
          created_at,
          users:author_id!inner(
            id,
            name,
            profile_image
          )
        `)
        .single() as { data: CommentResponse | null; error: Error };

      if (error) {
        setPosts(prevPosts => prevPosts.map(post => ({
          ...post,
          comments: post.comments.filter(comment => comment.id !== tempComment.id)
        })));
        throw error;
      }

      // 게시글 정보를 직접 조회하여 알림 생성
      const { data: postData } = await supabase
        .from('posts')
        .select(`
          *,
          boards!board_id(
            group_id
          )
        `)
        .eq('id', postId)
        .single();

      if (postData) {
        await createNotification({
          userId: postData.author_id,
          actorId: userData.user.id,
          type: 'comment',
          postId,
          boardId: postData.board_id,
          groupId: postData.boards.group_id,
        });
      }

      if (newComment && newComment.users) {
        const userInfo = {
          id: newComment.users.id,
          name: newComment.users.name,
          profile_image: newComment.users.profile_image || '/images/default-profile.png'
        };
        setPosts(prevPosts => prevPosts.map(post => {
          if (post.id !== postId) return post;
            return {
              ...post,
              comments: post.comments.map(comment => 
              comment.id === tempComment.id
                ? {
                    id: newComment.id,
                    content: newComment.content,
                    user: userInfo,
                    createdAt: newComment.created_at,
                    replies: []
                  }
                  : comment
              )
            };
        }));
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err instanceof Error ? err.message : '댓글 작성에 실패했습니다.');
    }
  }, [posts]);

  const editComment = useCallback(async (postId: string, commentId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ content })
        .eq('id', commentId);

      if (error) throw error;
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '댓글 수정에 실패했습니다.');
    }
  }, [fetchPosts]);

  const deleteComment = useCallback(async (postId: string, commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '댓글 삭제에 실패했습니다.');
    }
  }, [fetchPosts]);

  const addReply = useCallback(async (postId: string, commentId: string, content: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('로그인이 필요합니다.');

      const tempReply = {
        id: 'temp-reply-' + Date.now(),
        content,
        user: {
          id: userData.user.id,
          name: userData.user.user_metadata?.name || '',
          profile_image: userData.user.user_metadata?.avatar_url || '/images/default-profile.png',
        },
        createdAt: new Date().toISOString()
      };

      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id !== postId) return post;
            return {
              ...post,
              comments: post.comments.map(comment => {
            if (comment.id !== commentId) return comment;
                  return {
                    ...comment,
              replies: [...(comment.replies || []), tempReply]
            };
          })
        };
      }));

      const { data: newReply, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_id: userData.user.id,
          content,
          parent_id: commentId,
          created_at: new Date().toISOString()
        })
        .select(`
          id,
          content,
          created_at,
          users:author_id!inner(
            id,
            name,
            profile_image
          )
        `)
        .single() as { data: CommentResponse | null; error: Error };

      // 게시글과 댓글 정보를 직접 조회하여 알림 생성
      const { data: postData } = await supabase
        .from('posts')
        .select(`
          *,
          boards!board_id(
            group_id
          ),
          comments!inner(
            id,
            author_id
          )
        `)
        .eq('id', postId)
        .single();

      if (postData) {
        const comment = postData.comments.find((c: CommentData) => c.id === commentId);
        if (comment) {
          await createNotification({
            userId: comment.author_id,
            actorId: userData.user.id,
            type: 'reply',
            postId,
            commentId,
            boardId: postData.board_id,
            groupId: postData.boards.group_id,
          });
        }
      }

      if (error) {
        setPosts(prevPosts => prevPosts.map(post => ({
          ...post,
          comments: post.comments.map(comment => ({
            ...comment,
            replies: (comment.replies || []).filter(reply => reply.id !== tempReply.id)
          }))
        })));
        throw error;
      }

      if (newReply && newReply.users) {
        const userInfo = {
          id: newReply.users.id,
          name: newReply.users.name,
          profile_image: newReply.users.profile_image || '/images/default-profile.png'
        };

        setPosts(prevPosts => prevPosts.map(post => {
          if (post.id !== postId) return post;
            return {
              ...post,
              comments: post.comments.map(comment => {
              if (comment.id !== commentId) return comment;
                  return {
                    ...comment,
                replies: (comment.replies || []).map(reply =>
                  reply.id === tempReply.id
                    ? {
                        id: newReply.id,
                        content: newReply.content,
                        user: userInfo,
                        createdAt: newReply.created_at
                      }
                        : reply
                    )
              };
            })
          };
        }));
      }
    } catch (err) {
      console.error('Error adding reply:', err);
      setError(err instanceof Error ? err.message : '답글 작성에 실패했습니다.');
    }
  }, [posts]);

  const editReply = useCallback(async (postId: string, commentId: string, replyId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ content })
        .eq('id', replyId);

      if (error) throw error;
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '답글 수정에 실패했습니다.');
    }
  }, [fetchPosts]);

  const deleteReply = useCallback(async (postId: string, commentId: string, replyId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', replyId);

      if (error) throw error;
      await fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '답글 삭제에 실패했습니다.');
    }
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('comments-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${posts.map(p => p.id).join(',')}`
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const { data: comment } = await supabase
              .from('comments')
              .select(`
                id,
                content,
                post_id,
                parent_id,
                created_at,
                users!author_id (
                  id,
                  name,
                  profile_image
                )
              `)
              .eq('id', payload.new.id)
              .single() as { data: RealtimeCommentResponse | null };

            if (comment) {
              const userInfo = {
                id: comment.users.id,
                name: comment.users.name,
                profile_image: comment.users.profile_image || '/images/default-profile.png'
              };
              
              setPosts(prevPosts => prevPosts.map(post => {
                if (post.id === comment.post_id) {
                  if (comment.parent_id) {
                    return {
                      ...post,
                      comments: post.comments.map(existingComment => {
                        if (existingComment.id === comment.parent_id) {
                          const hasTempReply = existingComment.replies?.some(r => r.id.startsWith('temp-reply-'));
                          if (hasTempReply) return existingComment;

                          return {
                            ...existingComment,
                            replies: [...(existingComment.replies || []), {
                              id: comment.id,
                              content: comment.content,
                              user: userInfo,
                              createdAt: comment.created_at
                            }]
                          };
                        }
                        return existingComment;
              })
            };
          }
                  
                  const hasTempComment = post.comments.some(c => c.id.startsWith('temp-'));
                  if (hasTempComment) return post;

                  return {
                    ...post,
                    comments: [...post.comments, {
                      id: comment.id,
                      content: comment.content,
                      user: userInfo,
                      createdAt: comment.created_at,
                      replies: []
                    }]
                  };
                }
                return post;
              }));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPosts, posts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, selectedBoardId, selectedGroupId, filter.type]);

  return {
    posts,
    loading,
    error,
    filter,
    setFilter,
    addPost,
    editPost,
    deletePost,
    likePost,
    addComment,
    editComment,
    deleteComment,
    addReply,
    editReply,
    deleteReply
  };
};