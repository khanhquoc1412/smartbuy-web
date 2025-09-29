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

// ⚡ Dùng cart.ts thay vì product.ts
import { 
  fetchUserCarts, 
  addProductToCart, 
  removeProductInCart, 
  decreaseQuantity 
} from "@/api/cart/cart";

const useCartStore = defineStore({
  id: "cart",
  state,
  actions: {
    async getUserCarts(userId: string | number) {
      try {
        this.loadingCart = true;
        const data = await fetchUserCarts(userId);

        if (data) {
          this.carts = data.carts;
          this.totalItem = data.totalItem;
          return Promise.resolve(data);
        }
        this.loadingCart = false;
      } catch (error) {
        this.loadingCart = false;
        return Promise.reject(error);
      }
    },

    // Khi user chưa login
    addCartLocal(productVariantId: string | number) {
      // bạn có thể lưu localStorage tạm ở đây
    },

    async removeFromCart(cartItemId: number) {
      const userId = localStorage.getItem(USER_ID);
      if (!userId || !cartItemId) {
        return;
      }
      await removeProductInCart(cartItemId);
      this.carts = this.carts.filter(cartItem => cartItem.id !== cartItemId);
    },

    increaseQuantity(cartItemId: number) {
      const userId = localStorage.getItem(USER_ID);
      if (!userId || !cartItemId) {
        return;
      }

      const cartItemUpdate = this.carts.find(cartItem => cartItem.id === cartItemId);
      if (cartItemUpdate) {
        addProductToCart(userId, cartItemUpdate.productVariant.id as number);
      }

      this.carts = this.carts.map(cartItem => {
        if (cartItem.id === cartItemId) {
          return { ...cartItem, quantity: cartItem.quantity + 1 };
        }
        return cartItem;
      });
    },

    decreaseQuantity(cartItemId: number) {
      const userId = localStorage.getItem(USER_ID);
      if (!userId || !cartItemId) {
        return;
      }

      const cartItemUpdate = this.carts.find(cartItem => cartItem.id === cartItemId);
      if (cartItemUpdate && cartItemUpdate.quantity > 1) {
        decreaseQuantity(cartItemId);
      }

      this.carts = this.carts.map(cartItem => {
        if (cartItem.id === cartItemId) {
          if (cartItem.quantity <= 1) {
            return cartItem;
          }
          return { ...cartItem, quantity: cartItem.quantity - 1 };
        }
        return cartItem;
      });
    }
  },
});

export default useCartStore;
