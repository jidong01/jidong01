import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { BoardGroup } from '@/types/board';

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
          g.boards.some((b: any) => b.id === savedBoardId)
        )?.boards.find((b: any) => b.id === savedBoardId);
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

        const formattedGroups = groupsData.map(group => ({
          id: group.id,
          name: group.name,
          boards: boardsData
            .filter(board => board.group_id === group.id)
            .map(board => ({
              id: board.id,
              group_id: board.group_id,
              name: board.name,
              posts: []
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