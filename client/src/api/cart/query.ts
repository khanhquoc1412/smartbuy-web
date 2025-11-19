import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { 
  addToCart,
  getCart,
  updateQuantity,
  removeItem,
} from './cart';
import type { IAddToCartPayload } from '@/types/cart.types';

/**
 * 🔄 Query: Lấy giỏ hàng
 */
export const useGetCartQuery = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    retry: 1,
    staleTime: 30000,
  });
};

/**
 * ➕ Mutation: Thêm vào giỏ hàng
 */
export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['addToCart'],
    mutationFn: (payload: IAddToCartPayload) => addToCart(payload),
    onSuccess: () => {
      // Invalidate để refetch cart
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartCount'] });
    },
    onError: (error: any) => {
      console.error('❌ Add to cart failed:', error.response?.data || error.message);
    },
  });
};

/**
 * ✏️ Mutation: Cập nhật số lượng
 */
export const useUpdateQuantityMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['updateQuantity'],
    mutationFn: ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => 
      updateQuantity(cartItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartCount'] });
    },
  });
};

/**
 * 🗑️ Mutation: Xóa item
 */
export const useRemoveItemMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ['removeItem'],
    mutationFn: (cartItemId: string) => removeItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cartCount'] });
    },
  });
};