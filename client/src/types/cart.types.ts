import { IColor, IMemory, IProduct, IProductVariant } from "./product.types";

// ========== NEW CART TYPES (MICROSERVICES) ==========

export interface IAddToCartPayload {
  productId: string;
  variantId: string;
  quantity: number;
}

// ========== CART ITEM ==========
export interface ICartItem {
  id: string;           // Alias cho _id (để dễ sử dụng)
  _id: string;          // ID của item trong giỏ
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  productVariant: {
    _id: string;
    price: number;
    stock?: number;
    color?: {
      _id: string;
      name: string;
      hexCode: string;
    };
    memory?: {
      _id: string;
      ram: string;
      rom: string;
    };
    product?: {
      _id: string;
      name: string;
      slug: string;
      thumbUrl: string;
      discountPercentage?: number;
      status?: string;
    };
  };
}

// ========== CART DATA ==========
export interface ICartData {
  _id: string;
  userId: string;
  items: ICartItem[];
  subtotal: number;
  discount: number;
  total: number;
  finalTotal?: number;  // Có thể có hoặc không
  couponCode?: string;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

// ========== CART RESPONSE ==========
export interface ICartResponse {
  success: boolean;
  message: string;
  data: {
    cart: ICartData;
  };
}

export interface INewCartResponse extends ICartResponse {}

export interface ICartCountResponse {
  success: boolean;
  data: {
    count: number;
    itemCount?: number;
  };
}

// ========== LEGACY TYPES (để tương thích code cũ) ==========
export interface ILegacyCart {
  id: number;
  productVariantId: number;
  quantity: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  productVariant: any;
}

export interface ICartProductVariant {
  id?: number;
  stock?: number;
  price: number;
  productId: string;
  color?: IColor;
  memory?: IMemory;
  product?: IProduct;
}

export interface IUserCarts {
  carts: ILegacyCart[];
  totalItem: number;
}