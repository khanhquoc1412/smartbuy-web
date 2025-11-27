import { IAddress } from "./address.type";
import { ICartItem } from "./cart.types";
import { IPayment } from "./payment.type";
import { IParams, IProductVariant } from "./product.types";

export interface IOrderParams extends IParams {
  status?: string | string[]; // Hỗ trợ filter theo 1 hoặc nhiều status
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
}

export interface IOrderItem {
  product: string; // ObjectId
  name: string;
  sku?: string;
  qty: number;
  price: number;
  image?: string;
  variant?: {
    color?: string;
    memory?: string;
    variantId?: string;
  };
  _id?: string;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  addressId?: string;
}

export interface IOrderInfor {
  user?: string | null;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: 'COD' | 'VNPAY' | 'MOMO' | 'ZALOPAY' | 'PAYPAL' | 'CREDIT_CARD';
  itemsPrice: number;
  shippingPrice?: number;
  taxPrice?: number;
  discountAmount?: number;
  couponCode?: string;
  totalPrice: number;
  notes?: string;
}

// For guest orders we accept the same order shape as IOrderInfor
export interface IOrderInforGuest extends IOrderInfor { }

export interface IOrder {
  id: string; // Virtual id from mongoose
  _id: string;
  user: string | any;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentStatus: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  discountAmount: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  orderNumber?: string;
  statusHistory?: {
    status: string;
    timestamp: string;
    note?: string;
  }[];
  // Helper fields for UI if needed, but backend returns flat structure
  // address: IAddress; // Removed as backend uses shippingAddress
}

export interface IOrderListResponse {
  success: boolean;
  data: IOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IOrderStatus {
  id: number | string;
  title?: string;
  value?: string;
  name?: string;
}