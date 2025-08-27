export interface User {
  id: string;
  email: string;
  username: string;
  bio: string;
  image: string;
}

export interface Profile {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  favorited: boolean;
  favoritesCount: number;
  createdAt: string;
  updatedAt: string;
  tagList: string[];
  author: Profile;
}

export interface Comment {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: Profile;
}

export interface AuthUser {
  user: User & { token: string };
}

export interface LoginRequest {
  user: {
    email: string;
    password: string;
  };
}

export interface RegisterRequest {
  user: {
    email: string;
    username: string;
    password: string;
  };
}

export interface NewArticleRequest {
  article: {
    title: string;
    description: string;
    body: string;
    tagList: string[];
  };
}

export interface UpdateArticleRequest {
  article: {
    title?: string;
    description?: string;
    body?: string;
    tagList?: string[];
  };
}

export interface NewCommentRequest {
  comment: {
    body: string;
  };
}

export interface UpdateUserRequest {
  user: {
    email?: string;
    username?: string;
    password?: string;
    bio?: string;
    image?: string;
  };
}

export interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

export interface CommentsResponse {
  comments: Comment[];
}

export interface TagsResponse {
  tags: string[];
}

export interface ApiError {
  errors: Record<string, string[]>;
}
