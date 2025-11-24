import type { ICartItem } from '@/types/cart.types';

export const getTotalAmount = (items: ICartItem[]): number => {
  if (!items || !Array.isArray(items)) return 0;
  
  return items.reduce((total, item) => {
    const price = item.productVariant?.price || 0;
    const quantity = item.quantity || 0;
    const discount = item.productVariant?.product?.discountPercentage || 0;
    
    // Tính giá sau giảm giá
    const discountedPrice = price * (1 - discount / 100);
    
    return total + (discountedPrice * quantity);
  }, 0);
};