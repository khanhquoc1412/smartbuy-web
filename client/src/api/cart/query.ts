import {
    useMutation,
    useQuery,
} from "vue-query";
import {
    addProductToCart,
    fetchUserCarts
} from "./cart";

export const useGetUserCarts = (userId: string | number) => {
    return useQuery("user-carts", () =>
        fetchUserCarts(userId),
        {
            refetchOnWindowFocus: false,
        }
    );
};


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