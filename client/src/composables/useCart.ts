// import { storeToRefs } from "pinia";
// import { useAddProductToCartMutation, useGetUserCarts } from "@/api/product/query";
// import useCartStore from "@/store/cart";
// import { IUserCarts } from "@/types/cart.types";

// export const useCart = () => {
//     const { carts, loadingCart: isLoadingCart, totalItem } = storeToRefs(useCartStore());
//     const { getUserCarts, increaseQuantity,removeFromCart,
//         decreaseQuantity } = useCartStore()
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
//             await addToCartMutateAsync({
//                 userId,
//                 productVariantId
//             });
//             if (cartResponse && cartResponse.value) {

//             }
//         } finally {
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
//         decreaseQuantity
//     }
// };






import { storeToRefs } from "pinia";
import { useAddProductToCartMutation, useGetUserCarts } from "@/api/cart/query"; // 👉 import đúng service
import useCartStore from "@/store/cart";
import { IUserCarts } from "@/types/cart.types";

export const useCart = () => {
    const { carts, loadingCart: isLoadingCart, totalItem } = storeToRefs(useCartStore());
    const { getUserCarts, increaseQuantity, removeFromCart, decreaseQuantity } = useCartStore();

    const {
        data: cartResponse,
        isLoading: isAddLoading,
        error: isAddError,
        mutateAsync: addToCartMutateAsync,
    } = useAddProductToCartMutation();

    const addToCart = async ({
        userId,
        productVariantId,
    }: {
        userId: string | number;
        productVariantId: string | number;
    }) => {
        try {
            await addToCartMutateAsync({ userId, productVariantId });

            if (cartResponse && cartResponse.value) {
                // Có thể cập nhật lại store ở đây
                // ví dụ: carts.value.push(cartResponse.value)
            }
        } finally {
            // cleanup nếu cần
        }
    };

    return {
        cartResponse,
        isAddLoading,
        isAddError,
        addToCart,
        carts,
        isLoadingCart,
        totalItem,
        getUserCarts,
        increaseQuantity,
        removeFromCart,
        decreaseQuantity,
    };
};
