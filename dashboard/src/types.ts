export type OrderStatus = 'pending' | 'confirmed' | 'delivered';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  wilaya_id: string;
  baladiya_id: string;
  total_price: number;
  status: OrderStatus;
  created_at: string;
  wilaya?: Wilaya;
  baladiya?: Baladiya;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Wilaya {
  id: string;
  name: string;
  code: string;
}

export interface Baladiya {
  id: string;
  name: string;
  wilaya_id: string;
}

export interface Customer {
  name: string;
  phone: string;
  order_count: number;
}
