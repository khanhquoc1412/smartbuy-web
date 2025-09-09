import { ICartResponse, IUserCarts } from "@/types/cart.types";
import { IParams } from "@/types/product.types";
import { $axios } from "@plugins/axios/axios";

export const addProductToCart = (
    userId: string | number,
    productVariantId: string | number
) => {
    return $axios.post<unknown, ICartResponse>(`/carts/add`, {
        userId,
        productVariantId,
    });
};

export const removeProductInCart = (
    cartItemId: string | number,
) => {
    return $axios.delete<unknown, unknown>(`/carts/${cartItemId}`);
};

export const decreaseQuantity = (
    cartItemId: string | number,
) => {
    return $axios.patch<unknown, unknown>(`/carts/decr-qty/${cartItemId}`);
};


export const fetchUserCarts = (userId: string | number, params?: IParams) => {
    return $axios.get<unknown, IUserCarts>(`/carts/user/${userId}`, {
        params,
    });
};