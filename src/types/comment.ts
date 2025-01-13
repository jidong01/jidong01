export interface Comment {
  id: string;
  content: string;
  author_id: string;
  post_id: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  author: {
    id: string;
    name: string;
    profile_image: string | null;
  };
}