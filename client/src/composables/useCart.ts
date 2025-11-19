
// import { storeToRefs } from "pinia";
// import { useAddProductToCartMutation, useGetUserCarts } from "@/api/cart/query"; // 👉 import đúng service
// import useCartStore from "@/store/cart";
// import { IUserCarts } from "@/types/cart.types";

// export const useCart = () => {
//     const { carts, loadingCart: isLoadingCart, totalItem } = storeToRefs(useCartStore());
//     const { getUserCarts, increaseQuantity, removeFromCart, decreaseQuantity } = useCartStore();

//     const {
//         data: cartResponse,
//         isLoading: isAddLoading,
//         error: isAddError,
//         mutateAsync: addToCartMutateAsync,
//     } = useAddProductToCartMutation();

//     const addToCart = async ({
//         userId,
//         productVariantId,
//     }: {
//         userId: string | number;
//         productVariantId: string | number;
//     }) => {
//         try {
//             await addToCartMutateAsync({ userId, productVariantId });

//             if (cartResponse && cartResponse.value) {
//                 // Có thể cập nhật lại store ở đây
//                 // ví dụ: carts.value.push(cartResponse.value)
//             }
//         } finally {
//             // cleanup nếu cần
//         }
//     };

//     return {
//         cartResponse,
//         isAddLoading,
//         isAddError,
//         addToCart,
//         carts,
//         isLoadingCart,
//         totalItem,
//         getUserCarts,
//         increaseQuantity,
//         removeFromCart,
//         decreaseQuantity,
//     };
// };





import { computed, ref } from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { 
  getCart, 
  getCartCount, 
  addToCart as addToCartApi,
  updateCartItemAPI,
  removeCartItemAPI,
} from '@/api/cart/cart';
import type { 
  IAddToCartPayload, 
  INewCartResponse,
  ICartCountResponse,
  ICartItem,
} from '@/types/cart.types';

export const useCart = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { loggedIn, userId } = useAuth();

  const isAuthenticated = () => {
    return loggedIn.value;
  };

  const requireAuth = () => {
    if (!isAuthenticated()) {
      alert('⚠️ Vui lòng đăng nhập để thực hiện chức năng này');
      router.push('/login');
      return false;
    }
    return true;
  };

  // ========== QUERIES ==========
  
  const {
    data: cart,
    isLoading: isLoadingCart,
    error: cartError,
    refetch: refetchCart,
  } = useQuery<INewCartResponse>({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: computed(() => isAuthenticated()),
    retry: 1,
    staleTime: 30000,
  });

  const {
    data: cartCount,
    refetch: refetchCartCount,
  } = useQuery<ICartCountResponse>({
    queryKey: ['cartCount'],
    queryFn: getCartCount,
    enabled: computed(() => isAuthenticated()),
    retry: 1,
    staleTime: 30000,
  });

  // ========== MUTATIONS ==========

  const isAddingToCart = ref(false);
  const addCartError = ref<any>(null);
  const isUpdating = ref(false);
  const isRemoving = ref(false);

  // ========== HELPER FUNCTIONS ==========

  // Get user cart
  const getUserCarts = async (userId: string) => {
    if (!userId || !requireAuth()) return;
    
    try {
      console.log('🛒 Fetching cart for user:', userId);
      await refetchCart();
    } catch (error) {
      console.error('❌ Error fetching cart:', error);
    }
  };

  // Add to cart
  const addToCart = async (payload: IAddToCartPayload) => {
    console.log('🛒 [STEP 1] addToCart called with:', payload);
    
    // Validate
    if (!payload || typeof payload !== 'object') {
      console.error('❌ Invalid payload type');
      alert('❌ Dữ liệu không hợp lệ');
      return;
    }

    if (!payload.productId) {
      console.error('❌ Missing productId');
      alert('❌ Thiếu thông tin sản phẩm');
      return;
    }

    if (!payload.variantId) {
      console.error('❌ Missing variantId');
      alert('❌ Vui lòng chọn phiên bản sản phẩm');
      return;
    }

    if (!payload.quantity || payload.quantity < 1) {
      console.error('❌ Invalid quantity');
      alert('❌ Số lượng không hợp lệ');
      return;
    }

    if (!requireAuth()) {
      return;
    }
    
    console.log('🛒 [STEP 2] All validation passed');
    console.log('🛒 [STEP 3] Calling API directly with:', payload);
    
    isAddingToCart.value = true;
    addCartError.value = null;
    
    try {
      const response = await addToCartApi(payload);
      console.log('✅ API response:', response);
      
      // Invalidate queries để refetch
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
      await queryClient.invalidateQueries({ queryKey: ['cartCount'] });
      
      const itemCount = response?.data?.cart?.itemCount || 0;
      alert(`✅ Đã thêm vào giỏ hàng! (Tổng: ${itemCount} sản phẩm)`);
      
      isAddingToCart.value = false;
      return response;
      
    } catch (error: any) {
      console.error('❌ API error:', error);
      console.error('❌ Error response:', error.response?.data);
      
      addCartError.value = error;
      isAddingToCart.value = false;
      
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        'Có lỗi xảy ra khi thêm vào giỏ hàng';
      
      alert(`❌ ${errorMessage}`);
      
      throw error;
    }
  };

  // Update quantity
  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!requireAuth()) return;
    
    if (quantity < 1) {
      alert('❌ Số lượng phải lớn hơn 0');
      return;
    }
    
    isUpdating.value = true;
    
    try {
      console.log('🔄 Updating quantity:', { cartItemId, quantity });
      
      const response = await updateCartItemAPI(cartItemId, quantity);
      console.log('✅ Quantity updated:', response);
      
      // Invalidate queries để refetch
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
      await queryClient.invalidateQueries({ queryKey: ['cartCount'] });
      
      isUpdating.value = false;
      return response;
      
    } catch (error: any) {
      console.error('❌ Error updating quantity:', error);
      isUpdating.value = false;
      
      const errorMessage = 
        error?.response?.data?.message || 
        'Có lỗi xảy ra khi cập nhật số lượng';
      
      alert(`❌ ${errorMessage}`);
      throw error;
    }
  };

  // Remove item
  const removeItem = async (cartItemId: string) => {
    if (!requireAuth()) return;
    
    isRemoving.value = true;
    
    try {
      console.log('🗑️ Removing item:', cartItemId);
      
      const response = await removeCartItemAPI(cartItemId);
      console.log('✅ Item removed:', response);
      
      // Invalidate queries để refetch
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
      await queryClient.invalidateQueries({ queryKey: ['cartCount'] });
      
      isRemoving.value = false;
      return response;
      
    } catch (error: any) {
      console.error('❌ Error removing item:', error);
      isRemoving.value = false;
      
      const errorMessage = 
        error?.response?.data?.message || 
        'Có lỗi xảy ra khi xóa sản phẩm';
      
      alert(`❌ ${errorMessage}`);
      throw error;
    }
  };

  // ========== COMPUTED ==========

  const totalItems = computed(() => {
    return cart.value?.data?.cart?.itemCount || 
           cartCount.value?.data?.count || 
           0;
  });

  // Alias cho totalItem (để tương thích với code cũ)
  const totalItem = totalItems;

  const totalPrice = computed(() => {
    return cart.value?.data?.cart?.finalTotal || 
           cart.value?.data?.cart?.total || 
           0;
  });

  const cartItems = computed((): ICartItem[] => {
    return cart.value?.data?.cart?.items || [];
  });

  const isEmpty = computed(() => {
    return cartItems.value.length === 0;
  });

  // ========== RETURN ==========

  return {
    // Data
    cart,
    cartCount,
    cartItems,
    totalItems,
    totalItem, // Alias
    totalPrice,
    isEmpty,
    
    // Loading states
    isLoadingCart,
    isAddingToCart: computed(() => isAddingToCart.value),
    isAddLoading: computed(() => isAddingToCart.value),
    isUpdating: computed(() => isUpdating.value),
    isRemoving: computed(() => isRemoving.value),
    
    // Error states
    cartError,
    isAddError: computed(() => !!addCartError.value),
    
    // Actions
    addToCart,
    getUserCarts,
    updateQuantity,
    removeItem,
    refetchCart,
    refetchCartCount,
    
    // Auth
    isAuthenticated,
  };
};