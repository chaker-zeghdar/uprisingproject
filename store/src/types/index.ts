export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category_id: string;
  is_active: boolean;
  created_at: string;
  category?: Category;
}

export interface Wilaya {
  id: number;
  name: string;
}

export interface Baladiya {
  id: string;
  name: string;
  wilaya_id: number;
}

export interface Order {
  id: string;
  full_name: string;
  phone: string;
  wilaya_id: number;
  baladiya_id: string;
  address: string;
  notes?: string;
  total_price: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface CartItem extends Product {
  quantity: number;
}
