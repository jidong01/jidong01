import { User } from './user';
import { Post } from './post';

export interface Like {
  id: string;
  postId: string;
  post: Post;
  userId: string;
  user: User;
  createdAt: Date;
}