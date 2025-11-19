import { cartAxios } from '@/plugins/axios/axios';
import type { 
  IAddToCartPayload,
  ICartResponse,
  ICartCountResponse,
} from '@/types/cart.types';

/**
 * Cart API - Kiến trúc Microservices
 */

// ========== QUẢN LÝ GIỎ HÀNG ==========

export const getCart = async (): Promise<ICartResponse> => {
  const response = await cartAxios.get<ICartResponse>('/cart');
  return response.data;
};

export const getCartCount = async (): Promise<ICartCountResponse> => {
  const response = await cartAxios.get<ICartCountResponse>('/cart/count');
  return response.data;
};

export const updateCartItemAPI = async (cartItemId: string, quantity: number) => {
  const response = await cartAxios.put(`/cart/update/${cartItemId}`, { quantity });
  return response.data;
};

export const removeCartItemAPI = async (cartItemId: string) => {
  const response = await cartAxios.delete(`/cart/remove/${cartItemId}`);
  return response.data;
};

export const validateCart = async (): Promise<ICartResponse> => {
  const response = await cartAxios.get<ICartResponse>('/cart/validate');
  return response.data;
};

export const syncCart = async (): Promise<ICartResponse> => {
  const response = await cartAxios.post<ICartResponse>('/cart/sync');
  return response.data;
};

export const clearCart = async (): Promise<ICartResponse> => {
  const response = await cartAxios.delete<ICartResponse>('/cart/clear');
  return response.data;
};

// ========== QUẢN LÝ SẢN PHẨM TRONG GIỎ ==========

/**
 * ➕ Thêm sản phẩm vào giỏ hàng (API MỚI)
 * Backend: POST /api/cart/add
 */
export const addToCart = async (data: IAddToCartPayload): Promise<ICartResponse> => {
  try {
    console.log('🔵 [API] Sending to backend:', {
      url: '/cart/add',
      method: 'POST',
      payload: data,
    });

    const response = await cartAxios.post<ICartResponse>('/cart/add', data);
    
    console.log('🟢 [API] Backend response:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('🔴 [API] Backend error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    
    throw error;
  }
};

export const updateQuantity = async (cartItemId: string, quantity: number): Promise<ICartResponse> => {
  const response = await cartAxios.patch<ICartResponse>(`/cart/item/${cartItemId}`, {
    quantity,
  });
  return response.data;
};

export const removeItem = async (cartItemId: string): Promise<ICartResponse> => {
  const response = await cartAxios.delete<ICartResponse>(`/cart/item/${cartItemId}`);
  return response.data;
};

// ========== QUẢN LÝ MÃ GIẢM GIÁ ==========

export const applyCoupon = async (code: string): Promise<ICartResponse> => {
  const response = await cartAxios.post<ICartResponse>('/cart/coupon', { code });
  return response.data;
};

export const removeCoupon = async (): Promise<ICartResponse> => {
  const response = await cartAxios.delete<ICartResponse>('/cart/coupon');
  return response.data;
};

// ========== HỖ TRỢ CODE CŨ (DEPRECATED) ==========

/**
 * @deprecated Dùng addToCart thay thế
 */
export const addProductToCart = async (
  userId: string | number,
  productVariantId: string | number
): Promise<ICartResponse> => {
  console.warn('⚠️ addProductToCart is deprecated, use addToCart instead');
  
  return addToCart({
    productId: String(productVariantId),
    variantId: String(productVariantId),
    quantity: 1,
  });
};

/**
 * @deprecated Dùng removeItem thay thế
 */
export const removeProductInCart = async (cartItemId: string | number): Promise<ICartResponse> => {
  console.warn('⚠️ removeProductInCart is deprecated, use removeItem instead');
  return removeItem(String(cartItemId));
};

/**
 * @deprecated Dùng updateQuantity thay thế
 */
export const decreaseQuantity = async (cartItemId: string | number): Promise<ICartResponse> => {
  console.warn('⚠️ decreaseQuantity is deprecated, use updateQuantity instead');
  
  const response = await cartAxios.patch<ICartResponse>(`/cart/item/${cartItemId}`, {
    quantity: -1,
  });
  return response.data;
};

/**
 * @deprecated Dùng getCart thay thế
 */
export const fetchUserCarts = async (userId: string | number, params?: any): Promise<ICartResponse> => {
  console.warn('⚠️ fetchUserCarts is deprecated, use getCart instead');
  
  const response = await cartAxios.get<ICartResponse>('/cart', { params });
  return response.data;
};

// ========== EXPORT ==========

const cartApi = {
  getCart,
  getCartCount,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
  applyCoupon,
  removeCoupon,
  syncCart,
  validateCart,
  updateCartItemAPI,
  removeCartItemAPI,
  
  // Deprecated
  addProductToCart,
  removeProductInCart,
  decreaseQuantity,
  fetchUserCarts,
};

export default cartApi;