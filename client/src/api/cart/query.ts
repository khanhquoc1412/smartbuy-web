// import {
//     useMutation,
//     useQuery,
// } from "vue-query";
// import {
//     addProductToCart,
//     fetchUserCarts
// } from "./cart";

// export const useGetUserCarts = (userId: string | number) => {
//     return useQuery("user-carts", () =>
//         fetchUserCarts(userId),
//         {
//             refetchOnWindowFocus: false,
//         }
//     );
// };


// export const useAddProductToCartMutation = () => {
//     return useMutation(
//         ["add-product-to-cart"],
//         ({
//             userId,
//             productVariantId,
//         }: {
//             userId: string | number;
//             productVariantId: string | number;
//         }) => addProductToCart(userId, productVariantId)
//     );
// };





import { useMutation, useQuery } from "vue-query";
import { addProductToCart, fetchUserCarts, removeProductInCart, decreaseQuantity } from "./cart";

// Lấy giỏ hàng của user
export const useGetUserCarts = (userId: string | number) => {
  return useQuery(
    ["user-carts", userId],
    () => fetchUserCarts(userId),
    {
      refetchOnWindowFocus: false,
    }
  );
};

// Thêm sản phẩm vào giỏ
export const useAddProductToCartMutation = () => {
  return useMutation(
    ["add-product-to-cart"],
    ({
      userId,
      productVariantId,
    }: {
      userId: string | number;
      productVariantId: string | number;
    }) => addProductToCart(userId, productVariantId)
  );
};

// Xóa sản phẩm trong giỏ
export const useRemoveProductInCartMutation = () => {
  return useMutation(
    ["remove-product-in-cart"],
    (cartItemId: string | number) => removeProductInCart(cartItemId)
  );
};

// Giảm số lượng sản phẩm trong giỏ
export const useDecreaseQuantityMutation = () => {
  return useMutation(
    ["decrease-quantity"],
    (cartItemId: string | number) => decreaseQuantity(cartItemId)
  );
};
