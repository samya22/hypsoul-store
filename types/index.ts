export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  isNew: boolean;
  featured: boolean;
  sizes?: string[];
  stock?: number;
}

export interface CartItem extends Product {
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customer: CustomerInfo;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: string;
  paymentId?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
}
