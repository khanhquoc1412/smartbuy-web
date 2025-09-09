import { ICartResponse, IUserCarts } from "@/types/cart.types";
import { IParams, IProduct, IProductVariant, IProductsListResponse } from "@/types/product.types";
import { $axios } from "@plugins/axios/axios";


export const fetchProduct = (params: IParams) => {
    return $axios.get<unknown, IProductsListResponse>('/product/get-all', {
        params
    })
}

export const fetchProductDetails = (slug: string) => {
    return $axios.get<unknown, IProduct>(`/product/${slug}`)
}

export const fetchProductVariant = (productVariantId: string) => {
    return $axios.get<unknown, IProductVariant>(`/product/variant/${productVariantId}`)
}

export const fetchProductOfCategory = (categoryName: string, params?: IParams) => {
    return $axios.get<unknown, IProductsListResponse>(
        `/product/get-all/${categoryName}`,
        {
            params,
        }
    );
};
export const fetchProductByKeyword = (keyword: string, params?: IParams) => {
    return $axios.get<unknown, IProductsListResponse>(
        `/product/search/${keyword}`,
        {
            params,
        }
    );
};
export const fetchBase = (quantity: number) => {
    return $axios.get<unknown, IProductsListResponse>('/product/sale', {
        params: {
            quantity
        }
    })
}
export const fetchProductFilter = (params: Ref<IParams>) => {
    return $axios.get<unknown, IProductsListResponse>('/product/get-all', {
        params: params.value
    })
}

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