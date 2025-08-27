import axios, { AxiosResponse } from 'axios';
import {
  AuthUser,
  LoginRequest,
  RegisterRequest,
  Article,
  ArticlesResponse,
  NewArticleRequest,
  UpdateArticleRequest,
  Comment,
  CommentsResponse,
  NewCommentRequest,
  Profile,
  TagsResponse,
  UpdateUserRequest
} from '../types';

const API_BASE_URL = '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (credentials: LoginRequest): Promise<AxiosResponse<AuthUser>> =>
    api.post('/users/login', credentials),
  
  register: (userData: RegisterRequest): Promise<AxiosResponse<AuthUser>> =>
    api.post('/users', userData),
  
  getCurrentUser: (): Promise<AxiosResponse<AuthUser>> =>
    api.get('/user'),
  
  updateUser: (userData: UpdateUserRequest): Promise<AxiosResponse<AuthUser>> =>
    api.put('/user', userData),
};

export const articlesApi = {
  getArticles: (params?: {
    tag?: string;
    author?: string;
    favorited?: string;
    limit?: number;
    offset?: number;
  }): Promise<AxiosResponse<ArticlesResponse>> =>
    api.get('/articles', { params }),
  
  getFeedArticles: (params?: {
    limit?: number;
    offset?: number;
  }): Promise<AxiosResponse<ArticlesResponse>> =>
    api.get('/articles/feed', { params }),
  
  getArticle: (slug: string): Promise<AxiosResponse<{ article: Article }>> =>
    api.get(`/articles/${slug}`),
  
  createArticle: (articleData: NewArticleRequest): Promise<AxiosResponse<{ article: Article }>> =>
    api.post('/articles', articleData),
  
  updateArticle: (slug: string, articleData: UpdateArticleRequest): Promise<AxiosResponse<{ article: Article }>> =>
    api.put(`/articles/${slug}`, articleData),
  
  deleteArticle: (slug: string): Promise<AxiosResponse<void>> =>
    api.delete(`/articles/${slug}`),
  
  favoriteArticle: (slug: string): Promise<AxiosResponse<{ article: Article }>> =>
    api.post(`/articles/${slug}/favorite`),
  
  unfavoriteArticle: (slug: string): Promise<AxiosResponse<{ article: Article }>> =>
    api.delete(`/articles/${slug}/favorite`),
};

export const commentsApi = {
  getComments: (slug: string): Promise<AxiosResponse<CommentsResponse>> =>
    api.get(`/articles/${slug}/comments`),
  
  createComment: (slug: string, commentData: NewCommentRequest): Promise<AxiosResponse<{ comment: Comment }>> =>
    api.post(`/articles/${slug}/comments`, commentData),
  
  deleteComment: (slug: string, commentId: string): Promise<AxiosResponse<void>> =>
    api.delete(`/articles/${slug}/comments/${commentId}`),
};

export const profilesApi = {
  getProfile: (username: string): Promise<AxiosResponse<{ profile: Profile }>> =>
    api.get(`/profiles/${username}`),
  
  followUser: (username: string): Promise<AxiosResponse<{ profile: Profile }>> =>
    api.post(`/profiles/${username}/follow`),
  
  unfollowUser: (username: string): Promise<AxiosResponse<{ profile: Profile }>> =>
    api.delete(`/profiles/${username}/follow`),
};

export const tagsApi = {
  getTags: (): Promise<AxiosResponse<TagsResponse>> =>
    api.get('/tags'),
};

export default api;
