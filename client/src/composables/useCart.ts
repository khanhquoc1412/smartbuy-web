
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
  removeMultipleItemsAPI,
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
      showToast('⚠️ Vui lòng đăng nhập để thực hiện chức năng này', 'error');
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
  // ========== MODAL STATE ==========
  const showAddToCartModal = ref(false);
  const addedCartItemId = ref<string | null>(null);
  const modalQuantity = ref(1);

  // ✅ Update modal quantity
  const updateModalQuantity = (newQuantity: number) => {
    modalQuantity.value = newQuantity;
    console.log('📝 Modal quantity updated to:', newQuantity);
  };
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
      showToast('❌ Dữ liệu không hợp lệ', 'error');
      return;
    }

    if (!payload.productId) {
      console.error('❌ Missing productId');
      showToast('❌ Thiếu thông tin sản phẩm', 'error');
      return;
    }

    if (!payload.variantId) {
      console.error('❌ Missing variantId');
      showToast('❌ Vui lòng chọn phiên bản sản phẩm', 'error');
      return;
    }

    if (!payload.quantity || payload.quantity < 1) {
      console.error('❌ Invalid quantity');
      showToast('❌ Số lượng không hợp lệ', 'error');
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
      showToast('✅ Đã thêm sản phẩm vào giỏ hàng!', 'success');

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

      showToast(`❌ ${errorMessage}`, 'error');

      throw error;
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    padding: 16px 24px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-size: 14px;
    animation: slideIn 0.3s ease;
  `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!requireAuth()) return;

    if (quantity < 1) {
      showToast('❌ Số lượng phải lớn hơn 0', 'error');
      return;
    }

    isUpdating.value = true;

    // ✅ Lưu previous state để rollback nếu lỗi
    const previousCart = cart.value;
    const previousCount = cartCount.value;

    try {
      // ✅ Tìm item hiện tại để biết quantity cũ
      const currentItem = cart.value?.items?.find((item: any) => item._id === cartItemId);
      const oldQuantity = currentItem?.quantity || 0;
      const quantityDiff = quantity - oldQuantity;

      console.log('🔄 Quantity change:', { oldQuantity, newQuantity: quantity, diff: quantityDiff });

      // ✅ OPTIMISTIC UPDATE 1: Update cart items
      queryClient.setQueryData(['cart'], (old: any) => {
        if (!old || !old.items) return old;

        const updatedItems = old.items.map((item: any) =>
          item._id === cartItemId
            ? { ...item, quantity }
            : item
        );

        // ✅ Tính lại total
        const newTotalPrice = updatedItems.reduce((sum: number, item: any) => {
          const itemPrice = item.quantity * item.priceAtAdd * (1 - (item.discountPercentage || 0) / 100);
          return sum + itemPrice;
        }, 0);

        const newItemCount = updatedItems.reduce((sum: number, item: any) => sum + item.quantity, 0);

        return {
          ...old,
          items: updatedItems,
          itemCount: newItemCount,
          totalPrice: newTotalPrice,
          finalTotal: newTotalPrice,
        };
      });

      // ✅ OPTIMISTIC UPDATE 2: Update cartCount
      queryClient.setQueryData(['cartCount'], (old: any) => {
        if (!old) return old;

        const currentCount = old.data?.count || 0;
        const newCount = currentCount + quantityDiff;

        console.log('📊 CartCount update:', { currentCount, diff: quantityDiff, newCount });

        return {
          ...old,
          data: {
            ...old.data,
            count: Math.max(0, newCount),
          },
        };
      });

      console.log('🔄 Updating quantity (optimistic):', { cartItemId, quantity });
      console.log('✅ UI updated immediately');

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
      queryClient.setQueryData(['cartCount'], previousCount);

      console.log('🔄 Rolled back to previous state');

      isUpdating.value = false;

      const errorMessage =
        error?.response?.data?.message ||
        'Có lỗi xảy ra khi cập nhật số lượng';

      showToast(`❌ ${errorMessage}`, 'error');
      throw error;
    }
  };


  const removeItem = async (cartItemId: string) => {
    if (!requireAuth()) return;

    isRemoving.value = true;

    const previousCart = cart.value;
    const previousCount = cartCount.value;

    try {
      // ✅ Tìm item để biết quantity cần trừ
      const itemToRemove = cart.value?.items?.find((item: any) => item._id === cartItemId);
      const quantityToRemove = itemToRemove?.quantity || 1;

      console.log('🗑️ Removing item:', { cartItemId, quantity: quantityToRemove });

      // ✅ OPTIMISTIC UPDATE 1: Remove item from cart
      queryClient.setQueryData(['cart'], (old: any) => {
        if (!old || !old.items) return old;

        const newItems = old.items.filter((item: any) => item._id !== cartItemId);

        const newTotalPrice = newItems.reduce((sum: number, item: any) => {
          return sum + (item.quantity * item.priceAtAdd * (1 - (item.discountPercentage || 0) / 100));
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

      // ✅ OPTIMISTIC UPDATE 2: Update cart count
      queryClient.setQueryData(['cartCount'], (old: any) => {
        if (!old) return old;

        const currentCount = old.data?.count || 0;
        const newCount = Math.max(0, currentCount - quantityToRemove);

        console.log('📊 CartCount after remove:', { currentCount, removed: quantityToRemove, newCount });

        return {
          ...old,
          data: {
            ...old.data,
            count: newCount,
          },
        };
      });

      console.log('🗑️ Item removed (optimistic)');
      console.log('✅ UI updated immediately');

      // ✅ Call API
      const response = await removeCartItemAPI(cartItemId);
      console.log('✅ API confirmed removal:', response);

      // ✅ Invalidate và refetch
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
      await queryClient.invalidateQueries({ queryKey: ['cartCount'] });

      const [cartResult, countResult] = await Promise.all([
        refetchCart(),
        refetchCartCount(),
      ]);

      console.log('✅ Refetch complete:', {
        cartItems: cartResult.data?.items?.length,
        totalCount: countResult.data?.data?.count,
      });

      isRemoving.value = false;
      return response;

    } catch (error: any) {
      console.error('❌ Error removing item, rolling back:', error);

      // ✅ ROLLBACK
      queryClient.setQueryData(['cart'], previousCart);
      queryClient.setQueryData(['cartCount'], previousCount);

      console.log('🔄 Rolled back to previous state');

      isRemoving.value = false;

      const errorMessage =
        error?.response?.data?.message ||
        'Có lỗi xảy ra khi xóa sản phẩm';

      showToast(`❌ ${errorMessage}`, 'error');
      throw error;
    }
  };

  const removeMultipleItems = async (itemIds: string[]) => {
    if (!requireAuth() || !itemIds.length) return;

    isRemoving.value = true;

    const previousCart = cart.value;
    const previousCount = cartCount.value;

    try {
      // ✅ Calculate total quantity to remove for optimistic update
      const itemsToRemove = cart.value?.items?.filter((item: any) => itemIds.includes(item._id)) || [];
      const totalQuantityToRemove = itemsToRemove.reduce((sum: number, item: any) => sum + item.quantity, 0);

      console.log('🗑️ Removing multiple items:', { itemIds, totalQuantity: totalQuantityToRemove });

      // ✅ OPTIMISTIC UPDATE 1: Remove items from cart
      queryClient.setQueryData(['cart'], (old: any) => {
        if (!old || !old.items) return old;

        const newItems = old.items.filter((item: any) => !itemIds.includes(item._id));

        const newTotalPrice = newItems.reduce((sum: number, item: any) => {
          return sum + (item.quantity * item.priceAtAdd * (1 - (item.discountPercentage || 0) / 100));
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

      // ✅ OPTIMISTIC UPDATE 2: Update cart count
      queryClient.setQueryData(['cartCount'], (old: any) => {
        if (!old) return old;

        const currentCount = old.data?.count || 0;
        const newCount = Math.max(0, currentCount - totalQuantityToRemove);

        return {
          ...old,
          data: {
            ...old.data,
            count: newCount,
          },
        };
      });

      // ✅ Call API
      const response = await removeMultipleItemsAPI(itemIds);
      console.log('✅ API confirmed multiple removal:', response);

      // ✅ Invalidate và refetch
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
      await queryClient.invalidateQueries({ queryKey: ['cartCount'] });

      await Promise.all([
        refetchCart(),
        refetchCartCount(),
      ]);

      isRemoving.value = false;
      return response;

    } catch (error: any) {
      console.error('❌ Error removing multiple items, rolling back:', error);

      // ✅ ROLLBACK
      queryClient.setQueryData(['cart'], previousCart);
      queryClient.setQueryData(['cartCount'], previousCount);

      isRemoving.value = false;

      const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm';
      showToast(`❌ ${errorMessage}`, 'error');
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

    showAddToCartModal,
    modalQuantity,
    addedCartItemId,
    updateModalQuantity,
    // Actions
    addToCart,
    getUserCarts,
    updateQuantity,
    removeItem,
    removeMultipleItems,
    refetchCart,
    refetchCartCount,

    // Auth
    isAuthenticated,
  };
};