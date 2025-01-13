import { Post } from './post';

export interface Board {
  id: string;
  name: string;
  group_id: string;
  posts: Post[];
}

export interface BoardGroup {
  id: string;
  name: string;
  boards: Board[];
}

export interface BoardData {
  currentGroup: BoardGroup | null;
  currentBoard: Board | null;
}