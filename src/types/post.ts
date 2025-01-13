import { User } from './user';

// 게시글 관련 타입
export interface Post {
  id: string;
  boardId: string;
  title: string;
  content: string;
  boardGroupId: string;
  boardGroup: {
    id: string;
    name: string;
  };
  author: {
    id: string;
    name: string;
    profile_image: string;
  };
  createdAt: string;
  images: string[];
  likes: {
    count: number;
    likedUsers: {
      id: string;
      name: string;
      profile_image: string;
    }[];
  };
  comments: Comment[];
}

// 좋아요 관련 타입
export interface PostLikes {
  count: number;
  likedUsers: User[];
}

// 댓글 관련 타입
export interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
  replies?: Reply[];
}

// 답글 관련 타입
export interface Reply {
  id: string;
  content: string;
  user: User;
  createdAt: string;
}

// 게시글 필터 관련 타입
export type PostFilterType = 'all' | 'popular';

export interface PostFilter {
  type: PostFilterType;
  boardId?: string;
  boardGroupId?: string;
  searchQuery?: string;
}

// 게시글 정렬 관련 타입
export type PostSortField = 'createdAt' | 'likeCount' | 'commentCount';
export type PostSortOrder = 'asc' | 'desc';

export interface PostSort {
  field: PostSortField;
  order: PostSortOrder;
}

// 게시글 상태 관련 타입
export interface PostState {
  posts: Post[];
  filter: PostFilter;
  sort: PostSort;
}

// 게시글 컨텍스트 타입
export interface PostContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  filter: PostFilter;
  sort: PostSort;
  setPosts: (posts: Post[]) => void;
  setFilter: (filter: PostFilter) => void;
  setSort: (sort: PostSort) => void;
  likePost: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
}