export interface Notification {
  id: string;
  type: string;
  userId: string;
  actorId: string;
  postId: string;
  actor: {
    id: string;
    name: string;
    profileImage?: string;
  };
  board?: {
    id: string;
    name: string;
  };
  boardGroup?: {
    id: string;
    name: string;
  };
  isRead: boolean;
  createdAt: Date;
}
