export interface Post {
  id: string;
  title: string;
  content: string;
  boardId: string;
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
  images: string[];
  likes: {
    count: number;
    likedUsers: Array<{
      id: string;
      name: string;
      profile_image: string;
    }>;
  };
  comments: Array<{
    id: string;
    content: string;
    user: {
      id: string;
      name: string;
      profile_image: string;
    };
    createdAt: string;
    replies: Array<{
      id: string;
      content: string;
      user: {
        id: string;
        name: string;
        profile_image: string;
      };
      createdAt: string;
    }>;
  }>;
  createdAt: string;
}

export interface Board {
  id: string;
  group_id: string;
  name: string;
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