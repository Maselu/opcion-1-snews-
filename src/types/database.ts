export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
}

export interface Article {
  id: number;
  category_id?: number;
  title: string;
  content: string;
  source?: string;
  published_at: string;
  created_at: string;
  category?: Category;
}

export interface Comment {
  id: number;
  user_id: string;
  article_id?: number;
  topic_id?: number;
  parent_comment_id?: number;
  content: string;
  is_edited: boolean;
  edited_at?: string;
  created_at: string;
  user?: User;
  likes_count?: number;
  is_liked?: boolean;
  replies?: Comment[];
}

export interface Like {
  id: number;
  user_id: string;
  comment_id: number;
  created_at: string;
}

export interface Topic {
  id: number;
  user_id: string;
  article_id?: number;
  title: string;
  description?: string;
  created_at: string;
  user?: User;
  article?: Article;
  comments_count?: number;
}

export interface WeatherReport {
  id: number;
  location: string;
  data: any;
  fetched_at: string;
  created_at: string;
}
