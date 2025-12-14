export interface Sweet {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  price: number;
  quantity: number;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  sweet_id: string;
  quantity: number;
  total_price: number;
  created_at: string;
}

export type SweetCategory = 
  | 'Chocolates'
  | 'Gummies'
  | 'Hard Candy'
  | 'Lollipops'
  | 'Caramels'
  | 'Mints'
  | 'Licorice'
  | 'Other';

export const SWEET_CATEGORIES: SweetCategory[] = [
  'Chocolates',
  'Gummies',
  'Hard Candy',
  'Lollipops',
  'Caramels',
  'Mints',
  'Licorice',
  'Other',
];
