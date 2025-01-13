import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { BoardGroup, Board } from '@/types/board';

interface CommentUser {
  id: string;
  name: string;
  profile_image: string | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  parent_id: string | null;
  users: CommentUser;
}

interface Like {
  id: string;
  user_id: string;
  users: CommentUser;
}

interface PostData {
  id: string;
  title: string;
  content: string;
  board_id: string;
  board_group_id: string;
  created_at: string;
  users: CommentUser;
  images: string[];
  likes: Like[];
  comments: Comment[];
}

export const useBoards = () => {
  const [boardGroups, setBoardGroups] = useState<BoardGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [currentGroupName, setCurrentGroupName] = useState<string | null>(null);
  const [currentBoardName, setCurrentBoardName] = useState<string | null>(null);

  const selectGroup = useCallback((groupId: string) => {
    const selectedGroup = boardGroups.find(group => group.id === groupId);
    if (selectedGroup) {
      setSelectedGroupId(groupId);
      setCurrentGroupName(selectedGroup.name);
    }
  }, [boardGroups]);

  const selectBoard = useCallback((boardId: string) => {
    const selectedBoard = boardGroups.find(group => 
      group.boards.some(board => board.id === boardId)
    )?.boards.find(board => board.id === boardId);
    setSelectedBoardId(boardId);
    setCurrentBoardName(selectedBoard?.name || null);
  }, [boardGroups]);

  const updateGroup = (groups: BoardGroup[]) => {
    setBoardGroups(groups);
  };

  useEffect(() => {
    const savedState = localStorage.getItem('boardStorage');

    if (savedState) {
      const { boardGroups: savedGroups, selectedGroupId: savedGroupId, selectedBoardId: savedBoardId } = JSON.parse(savedState);
      setBoardGroups(savedGroups);
      setSelectedGroupId(savedGroupId);
      setSelectedBoardId(savedBoardId);
      
      if (savedGroupId) {
        const group = savedGroups.find((g: BoardGroup) => g.id === savedGroupId);
        setCurrentGroupName(group?.name || null);
      }
      if (savedBoardId) {
        const board = savedGroups.find((g: BoardGroup) => 
          g.boards.some((b: Board) => b.id === savedBoardId)
        )?.boards.find((b: Board) => b.id === savedBoardId);
        setCurrentBoardName(board?.name || null);
      }
    }
  }, []);

  useEffect(() => {
    if (boardGroups.length > 0) {
      localStorage.setItem('boardStorage', JSON.stringify({
        boardGroups,
        selectedGroupId,
        selectedBoardId,
      }));
    }
  }, [boardGroups, selectedGroupId, selectedBoardId]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const { data: groupsData, error: groupsError } = await supabase
          .from('board_groups')
          .select('*')
          .order('created_at');

        if (groupsError) throw groupsError;

        const { data: boardsData, error: boardsError } = await supabase
          .from('boards')
          .select('*')
          .order('created_at');

        if (boardsError) throw boardsError;

        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(`
            *,
            users:author_id(
              id,
              name,
              profile_image
            ),
            likes(
              id,
              user_id,
              users(
                id,
                name,
                profile_image
              )
            ),
            comments(
              id,
              content,
              created_at,
              parent_id,
              users:author_id(
                id,
                name,
                profile_image
              )
            )
          `)
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;

        const formattedGroups = groupsData.map(group => ({
          id: group.id,
          name: group.name,
          boards: boardsData
            .filter(board => board.group_id === group.id)
            .map(board => ({
              id: board.id,
              group_id: board.group_id,
              name: board.name,
              posts: postsData
                .filter((post: PostData) => post.board_id === board.id)
                .map((post: PostData) => ({
                  id: post.id,
                  title: post.title,
                  content: post.content,
                  boardId: post.board_id,
                  boardGroupId: post.board_group_id,
                  boardGroup: {
                    id: group.id,
                    name: group.name
                  },
                  createdAt: post.created_at,
                  author: {
                    id: post.users.id,
                    name: post.users.name,
                    profile_image: post.users.profile_image || '/images/default-profile.png'
                  },
                  images: post.images || [],
                  likes: {
                    count: post.likes?.length || 0,
                    likedUsers: post.likes?.map((like: Like) => ({
                      id: like.users.id,
                      name: like.users.name,
                      profile_image: like.users.profile_image || '/images/default-profile.png'
                    })) || []
                  },
                  comments: (post.comments || [])
                    .filter((comment: Comment) => !comment.parent_id)
                    .map((comment: Comment) => ({
                      id: comment.id,
                      content: comment.content,
                      user: {
                        id: comment.users.id,
                        name: comment.users.name,
                        profile_image: comment.users.profile_image || '/images/default-profile.png'
                      },
                      createdAt: comment.created_at,
                      replies: post.comments
                        .filter((reply: Comment) => reply.parent_id === comment.id)
                        .map((reply: Comment) => ({
                          id: reply.id,
                          content: reply.content,
                          user: {
                            id: reply.users.id,
                            name: reply.users.name,
                            profile_image: reply.users.profile_image || '/images/default-profile.png'
                          },
                          createdAt: reply.created_at
                        }))
                    }))
                }))
            }))
        }));

        setBoardGroups(formattedGroups);
      } catch (err) {
        setError(err instanceof Error ? err.message : '게시판 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  return { boardGroups, selectGroup, selectBoard, updateGroup, currentGroupName, currentBoardName, selectedGroupId, selectedBoardId, loading, error };
};