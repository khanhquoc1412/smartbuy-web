// import { fetchUserCarts, addProductToCart, removeProductInCart, decreaseQuantity } from "@/api/product/product";
// import { defineStore } from "pinia";
// import state from "./state";
// import { USER_ID } from "@/utils/constants";


// const useCartStore = defineStore({
//     id: "cart",
//     state,
//     actions: {
//         async getUserCarts(userId: string | number) {
//             try {
//                 this.loadingCart = true
//                 const data = await fetchUserCarts(userId);

//                 if (data) {
//                     this.carts = data.carts
//                     this.totalItem = data.totalItem
//                     return Promise.resolve(data);
//                 }
//                 this.loadingCart = false

//             } catch (error) {
//                 this.loadingCart = false
//                 return Promise.reject(error);
//             }
//         },

//         // When a user not logged
//         addCartLocal(productVariantId: string | number) {

//         },

//         async removeFromCart(cartItemId: number) {
//             const userId = localStorage.getItem(USER_ID);
//             if (!userId || !cartItemId) {
//                 return
//             }
//             const removeProduct = await removeProductInCart(cartItemId)
//             this.carts = this.carts.filter(cartItem => cartItem.id !== cartItemId);

//         },

//         // OPTIMIZE: optimized for better performance and ui
//         increaseQuantity(cartItemId: number) {
//             const userId = localStorage.getItem(USER_ID);
//             if (!userId || !cartItemId) {
//                 return
//             }
//             //get VariantId
//             const cartItemUpdate = this.carts.find(cartItem => cartItem.id === cartItemId)
//             if (cartItemUpdate) {
//                 const updateQuantity = addProductToCart(userId, cartItemUpdate?.productVariant.id as number)
//             }
//             // update quantity ui (optimize ui)
//             this.carts = this.carts.map((cartItem) => {
//                 if (cartItem.id === cartItemId) {
//                     return { ...cartItem, quantity: cartItem.quantity + 1 }
//                 }
//                 return cartItem
//             })
//         },
//         decreaseQuantity(cartItemId: number) {
//             const userId = localStorage.getItem(USER_ID);
//             if (!userId || !cartItemId) {
//                 return
//             }
//             //get VariantId
//             const cartItemUpdate = this.carts.find(cartItem => cartItem.id === cartItemId)
//             if (cartItemUpdate && cartItemUpdate.quantity > 1) {
//                 const updateQuantity = decreaseQuantity(cartItemId)
//             }
//             this.carts = this.carts.map((cartItem) => {
//                 if (cartItem.id === cartItemId) {
//                     if (cartItem.quantity <= 1) {
//                         return cartItem
//                     }
//                     return { ...cartItem, quantity: cartItem.quantity - 1 }
//                 }
//                 return cartItem
//             })
//         }


//     },
// });

// export default useCartStore;








import { defineStore } from "pinia";
import state from "./state";
import { USER_ID } from "@/utils/constants";
import { 
  getCart,
  removeItem,
  updateQuantity,
} from "@/api/cart/cart";

const useCartStore = defineStore({
  id: "cart",
  state,
  actions: {
    async getUserCarts(userId: string | number) {
      try {
        this.loadingCart = true;
        
        const response = await getCart();
        console.log('📥 Store getUserCarts:', response.data);
        
        const cartData = response.data?.data?.cart;
        
        if (cartData) {
          // Map items từ backend sang cấu trúc cũ
          this.carts = cartData.items.map((item: any) => ({
            id: item._id || item.id,
            quantity: item.quantity,
            productVariant: {
              id: item.variantId,
              price: item.price,
              productId: item.productId,
              product: item.product,
              color: item.variant?.color,
              memory: item.variant?.memory,
            }
          }));
          
          this.totalItem = cartData.itemCount;
          this.loadingCart = false;
          
          return Promise.resolve({
            carts: this.carts,
            totalItem: this.totalItem,
          });
        }
        
        this.loadingCart = false;
      } catch (error) {
        console.error('❌ getUserCarts error:', error);
        this.loadingCart = false;
        return Promise.reject(error);
      }
    },

    addCartLocal(productVariantId: string | number) {
      const localCart = JSON.parse(localStorage.getItem('cart_local') || '[]');
      localCart.push({ productVariantId, quantity: 1 });
      localStorage.setItem('cart_local', JSON.stringify(localCart));
    },

    async removeFromCart(cartItemId: number | string) {
      const userId = localStorage.getItem(USER_ID);
      if (!userId || !cartItemId) {
        return;
      }
      
      try {
        await removeItem(String(cartItemId));
        this.carts = this.carts.filter(
          cartItem => String(cartItem.id) !== String(cartItemId)
        );
        this.totalItem = this.carts.length;
      } catch (error) {
        console.error('❌ Remove error:', error);
      }
    },

    async increaseQuantity(cartItemId: number | string) {
      const userId = localStorage.getItem(USER_ID);
      if (!userId || !cartItemId) {
        return;
      }

      const cartItemUpdate = this.carts.find(
        cartItem => String(cartItem.id) === String(cartItemId)
      );
      
      if (!cartItemUpdate) return;

      const newQuantity = cartItemUpdate.quantity + 1;

      // Optimistic update
      this.carts = this.carts.map(cartItem => {
        if (String(cartItem.id) === String(cartItemId)) {
          return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
      });

      try {
        await updateQuantity(String(cartItemId), newQuantity);
      } catch (error) {
        // Rollback
        this.carts = this.carts.map(cartItem => {
          if (String(cartItem.id) === String(cartItemId)) {
            return { ...cartItem, quantity: newQuantity - 1 };
          }
          return cartItem;
        });
      }
    },

    async decreaseQuantity(cartItemId: number | string) {
      const userId = localStorage.getItem(USER_ID);
      if (!userId || !cartItemId) {
        return;
      }

      const cartItemUpdate = this.carts.find(
        cartItem => String(cartItem.id) === String(cartItemId)
      );
      
      if (!cartItemUpdate || cartItemUpdate.quantity <= 1) return;

      const newQuantity = cartItemUpdate.quantity - 1;

      this.carts = this.carts.map(cartItem => {
        if (String(cartItem.id) === String(cartItemId)) {
          return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
      });

      try {
        await updateQuantity(String(cartItemId), newQuantity);
      } catch (error) {
        this.carts = this.carts.map(cartItem => {
          if (String(cartItem.id) === String(cartItemId)) {
            return { ...cartItem, quantity: newQuantity + 1 };
          }
          return cartItem;
        });
      }
    }
  },
});

export default useCartStore;