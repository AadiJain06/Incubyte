import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';
import { Sweet } from '../types/sweet';

export interface CreateSweetRequest {
  name: string;
  category: string;
  description?: string | null;
  price: number;
  quantity: number;
  image_url?: string | null;
}

export interface UpdateSweetRequest {
  name?: string;
  category?: string;
  description?: string | null;
  price?: number;
  quantity?: number;
  image_url?: string | null;
}

// Get API URL from environment variable, with fallback
// In production, this should be set to: https://incubyte-sweet.onrender.com/api
// Note: VITE_API_URL must be set in Vercel environment variables
const getApiBaseUrl = () => {
  // Check if VITE_API_URL is explicitly set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Production fallback
  if (import.meta.env.PROD) {
    return 'https://incubyte-sweet.onrender.com/api';
  }
  
  // Development fallback
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

// Log API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
};

export const sweetsAPI = {
  getAll: async (): Promise<Sweet[]> => {
    const response = await api.get<Sweet[]>('/sweets');
    return response.data;
  },
  search: async (params: { name?: string; category?: string; minPrice?: string; maxPrice?: string }): Promise<Sweet[]> => {
    const response = await api.get<Sweet[]>('/sweets/search', { params });
    return response.data;
  },
  getById: async (id: string): Promise<Sweet> => {
    const response = await api.get<Sweet>(`/sweets/${id}`);
    return response.data;
  },
  create: async (data: CreateSweetRequest): Promise<Sweet> => {
    // Backend doesn't support description/image_url yet, so we only send supported fields
    const response = await api.post<Sweet>('/sweets', {
      name: data.name,
      category: data.category,
      price: data.price,
      quantity: data.quantity,
    });
    return response.data;
  },
  update: async (id: string, data: UpdateSweetRequest): Promise<Sweet> => {
    // Backend doesn't support description/image_url yet, so we only send supported fields
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.quantity !== undefined) updateData.quantity = data.quantity;
    const response = await api.put<Sweet>(`/sweets/${id}`, updateData);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/sweets/${id}`);
  },
  purchase: async (id: string, quantity: number): Promise<Sweet> => {
    const response = await api.post<Sweet>(`/sweets/${id}/purchase`, { quantity });
    return response.data;
  },
  restock: async (id: string, quantity: number): Promise<Sweet> => {
    const response = await api.post<Sweet>(`/sweets/${id}/restock`, { quantity });
    return response.data;
  },
};

export const purchasesAPI = {
  getHistory: async (): Promise<any[]> => {
    const response = await api.get<any[]>('/purchases/history');
    return response.data;
  },
};

export default api;

