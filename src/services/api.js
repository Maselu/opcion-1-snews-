import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/login',
    register: '/register',
    logout: '/logout',
    user: '/user',
  },
  // Article endpoints
  articles: {
    all: '/articles',
    byId: (id) => `/articles/${id}`,
    byCategory: (category) => `/articles/category/${category}`,
  },
  // Comment endpoints
  comments: {
    byArticle: (articleId) => `/articles/${articleId}/comments`,
    create: (articleId) => `/articles/${articleId}/comments`,
    update: (commentId) => `/comments/${commentId}`,
    delete: (commentId) => `/comments/${commentId}`,
  },
  // Like endpoints
  likes: {
    toggle: (commentId) => `/comments/${commentId}/like`,
    count: (commentId) => `/comments/${commentId}/likes`,
  },
  // Topic endpoints
  topics: {
    all: '/topics',
    byId: (id) => `/topics/${id}`,
    create: '/topics',
  },
  // Weather endpoint
  weather: {
    forecast: '/weather',
    byLocation: (location) => `/weather/${location}`,
  },
  // News endpoints
  news: {
    general: '/news/general',
    science: '/news/science',
    sports: '/news/sports',
    entertainment: '/news/entertainment',
  },
  // Profile endpoint
  profile: {
    get: '/profile',
    update: '/profile',
    stats: '/profile/stats',
  },
};

export default api;