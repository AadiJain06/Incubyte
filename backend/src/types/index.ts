export interface User {
  id: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  created_at: Date;
}

export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
}

// AuthRequest is now handled via global Express namespace extension in middleware/auth.ts

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateSweetRequest {
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface UpdateSweetRequest {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
}

export interface SearchSweetsQuery {
  name?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  sweet_id: string;
  quantity: number;
  total_price: number;
  created_at: Date;
}

export interface PurchaseWithSweet extends Purchase {
  sweet: {
    name: string;
    category: string;
    image_url?: string | null;
  } | null;
}

