
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
} = useQuery({
  queryKey: ['cart'],
  queryFn: async () => {
    const response = await getCart();
    
    console.log('✅ getCart response (after interceptor):', response);
    console.log('✅ response type:', typeof response);
    console.log('✅ response keys:', Object.keys(response || {}));
    
    // ✅ Interceptor unwrap: response = { success, message, data: { cart: {...} } }
    // Hoặc có thể là: response = { cart: {...} } nếu có thêm logic unwrap
    
    // Handle multiple cases:
    if (response && typeof response === 'object') {
      // Case 1: { data: { cart: {...} } }
      if (response.data?.cart) {
        return response.data.cart;
      }
      
      // Case 2: { cart: {...} }
      if (response.cart) {
        return response.cart;
      }
      
      // Case 3: Backend trả { success, message, data: { cart: {...} } }
      if ((response as any).success && (response as any).data?.cart) {
        return (response as any).data.cart;
      }
    }
    
    console.error('❌ Unexpected response structure:', response);
    throw new Error('Invalid cart response structure');
  },
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
      
       // ✅ FIX: Invalidate cache ngay lập tức
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['cart'], exact: true }),
      queryClient.invalidateQueries({ queryKey: ['cartCount'], exact: true }),
    ]);
    
    // ✅ Force refetch để update UI
    await refetchCart();
    await refetchCartCount();
      
      isAddingToCart.value = false;
    
    // ✅ Thông báo thành công
    alert('✅ Đã thêm sản phẩm vào giỏ hàng!');
      
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
  
  // ✅ Lưu previous state để rollback nếu lỗi
  const previousCart = cart.value;
  
  try {
    // ✅ OPTIMISTIC UPDATE: Update UI ngay trước khi gọi API
    queryClient.setQueryData(['cart'], (old: any) => {
      if (!old || !old.items) return old;
      
      return {
        ...old,
        items: old.items.map((item: any) => 
          item._id === cartItemId 
            ? { ...item, quantity } 
            : item
        ),
      };
    });
    
    console.log('🔄 Updating quantity (optimistic):', { cartItemId, quantity });
    
    // ✅ Call API
    const response = await updateCartItemAPI(cartItemId, quantity);
    console.log('✅ API confirmed update:', response);
    
    // ✅ Invalidate để refetch data thật từ server
    await queryClient.invalidateQueries({ queryKey: ['cart'] });
    await queryClient.invalidateQueries({ queryKey: ['cartCount'] });
    
    // ✅ Refetch để đảm bảo data sync
    await Promise.all([
      refetchCart(),
      refetchCartCount(),
    ]);
    
    isUpdating.value = false;
    return response;
    
  } catch (error: any) {
    console.error('❌ Error updating quantity, rolling back:', error);
    
    // ✅ ROLLBACK: Khôi phục state cũ nếu lỗi
    queryClient.setQueryData(['cart'], previousCart);
    
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
  
  // ✅ Lưu previous state để rollback nếu lỗi
  const previousCart = cart.value;
  const previousCount = cartCount.value;
  
  try {
    // ✅ OPTIMISTIC UPDATE: Xóa item khỏi UI ngay lập tức
    queryClient.setQueryData(['cart'], (old: any) => {
      if (!old || !old.items) return old;
      
      // Filter ra item bị xóa
      const newItems = old.items.filter((item: any) => item._id !== cartItemId);
      
      // Tính lại total
      const newTotalPrice = newItems.reduce((sum: number, item: any) => {
        return sum + (item.quantity * item.priceAtAdd * (1 - item.discountPercentage / 100));
      }, 0);
      
      const newItemCount = newItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
      
      return {
        ...old,
        items: newItems,
        totalItems: newItems.length,
        itemCount: newItemCount,
        totalPrice: newTotalPrice,
        finalTotal: newTotalPrice,
      };
    });
    
    // ✅ Update cart count optimistically
    queryClient.setQueryData(['cartCount'], (old: any) => {
      if (!old) return old;
      
      const currentCount = old.data?.count || 0;
      const itemToRemove = previousCart?.items?.find((item: any) => item._id === cartItemId);
      const quantityToRemove = itemToRemove?.quantity || 1;
      
      return {
        ...old,
        data: {
          ...old.data,
          count: Math.max(0, currentCount - quantityToRemove),
        },
      };
    });
    
    console.log('🗑️ Removing item (optimistic):', cartItemId);
    console.log('✅ UI updated immediately');
    
    // ✅ Call API để sync với backend
    const response = await removeCartItemAPI(cartItemId);
    console.log('✅ API confirmed removal:', response);
    
    // ✅ Invalidate queries để refetch data thật từ server
    await queryClient.invalidateQueries({ queryKey: ['cart'] });
    await queryClient.invalidateQueries({ queryKey: ['cartCount'] });
    
    // ✅ Refetch để đảm bảo sync với backend
    const [cartResult, countResult] = await Promise.all([
      refetchCart(),
      refetchCartCount(),
    ]);
    
    console.log('✅ Refetch complete, data synced:', {
      cartItems: cartResult.data?.items?.length,
      totalCount: countResult.data?.data?.count,
    });
    
    // ✅ Thông báo xóa thành công
    alert('✅ Đã xóa sản phẩm khỏi giỏ hàng!');
    
    isRemoving.value = false;
    return response;
    
  } catch (error: any) {
    console.error('❌ Error removing item, rolling back:', error);
    
    // ✅ ROLLBACK: Khôi phục state cũ nếu API lỗi
    queryClient.setQueryData(['cart'], previousCart);
    queryClient.setQueryData(['cartCount'], previousCount);
    
    console.log('🔄 Rolled back to previous state');
    
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
  return cart.value?.itemCount || 
         cartCount.value?.data?.count || 
         0;
});
  // Alias cho totalItem (để tương thích với code cũ)
  const totalItem = totalItems;

 const totalPrice = computed(() => {
  return cart.value?.finalTotal || 
         cart.value?.total || 
         0;
});

 const cartItems = computed((): ICartItem[] => {
  if (!cart.value?.items || !Array.isArray(cart.value.items)) {
    return [];
  }

  // ✅ Transform backend data sang frontend format
  return cart.value.items.map((item: any) => ({
    _id: item._id,
    id: item._id,
    productId: item.product,
    variantId: item.variant?.variantId,
    quantity: item.quantity,
    price: item.priceAtAdd,
    
    // ✅ Map productVariant từ backend structure
    productVariant: {
      _id: item.variant?.variantId || '',
      price: item.variant?.price || item.priceAtAdd || 0,
      stock: item.variant?.stock || 0,
      
      color: item.variant?.color ? {
        _id: item.variant.color.id,
        name: item.variant.color.name,
        hexCode: item.variant.color.code,
      } : undefined,
      
      memory: item.variant?.memory ? {
        _id: item.variant.memory.id,
        ram: item.variant.memory.ram,
        rom: item.variant.memory.rom,
      } : undefined,
      
      // ✅ Map product info từ item level
      product: {
        _id: item.product,
        name: item.productName,
        slug: item.productSlug,
        thumbUrl: item.thumbUrl,
        discountPercentage: item.discountPercentage || 0,
      },
    },
  }));
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