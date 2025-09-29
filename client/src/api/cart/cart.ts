// import { ICartResponse, IUserCarts } from "@/types/cart.types";
// import { IParams } from "@/types/product.types";

// // ⚡ Import cartAxios thay vì $axios
// import { cartAxios } from "@plugins/axios/axios";

// export const addProductToCart = (
//   userId: string | number,
//   productVariantId: string | number
// ) => {
//   return cartAxios.post<unknown, ICartResponse>(`/carts/add`, {
//     userId,
//     productVariantId,
//   });
// };

// export const removeProductInCart = (cartItemId: string | number) => {
//   return cartAxios.delete<unknown, unknown>(`/carts/${cartItemId}`);
// };

// export const decreaseQuantity = (cartItemId: string | number) => {
//   return cartAxios.patch<unknown, unknown>(`/carts/decr-qty/${cartItemId}`);
// };

// export const fetchUserCarts = (userId: string | number, params?: IParams) => {
//   return cartAxios.get<unknown, IUserCarts>(`/carts/user/${userId}`, {
//     params,
//   });
// };
import { ICartResponse, IUserCarts } from "@/types/cart.types";
import { IParams } from "@/types/product.types";

// ⚡ Dùng cartAxios cho CartService
import { cartAxios } from "@plugins/axios/axios";

// 📌 Thêm sản phẩm vào giỏ
export const addProductToCart = (
  userId: string | number,
  productVariantId: string | number
) => {
  return cartAxios.post<unknown, ICartResponse>(`/carts/add`, {
    userId,
    productVariantId,
  });
};

// 📌 Xóa sản phẩm trong giỏ
export const removeProductInCart = (cartItemId: string | number) => {
  return cartAxios.delete<unknown, unknown>(`/carts/${cartItemId}`);
};

// 📌 Giảm số lượng sản phẩm trong giỏ
export const decreaseQuantity = (cartItemId: string | number) => {
  return cartAxios.patch<unknown, unknown>(`/carts/decr-qty/${cartItemId}`);
};

// 📌 Lấy danh sách giỏ hàng của user
export const fetchUserCarts = (userId: string | number, params?: IParams) => {
  return cartAxios.get<unknown, IUserCarts>(`/carts/user/${userId}`, {
    params,
  });
};
