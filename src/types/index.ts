export type TCGKey = 'pokemon' | 'onePiece' | 'dragonball' | 'yugioh' | 'mtg';
export type ProductCategory = 'single' | 'sealed';
export type CardCondition = 'Near Mint' | 'Lightly Played' | 'Moderately Played' | 'Heavily Played' | 'Damaged';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface TCGConfig {
  key: TCGKey;
  label: string;
  primary: string;
  accent: string;
  enabled: boolean;
}

export interface Product {
  id: string;
  name: string;
  tcg: TCGKey;
  set: string;
  cardNumber?: string;
  rarity?: string;
  variance?: string;
  condition: CardCondition;
  price: number;
  stock: number;
  category: ProductCategory;
  isNew: boolean;
  dateAdded: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  zip: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  address: Address;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
