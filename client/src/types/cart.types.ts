import { IColor, IMemory, IProduct, IProductVariant } from "./product.types";
export interface ICart {
    id: number;
    quantity: number;
    productVariant: ICartProductVariant;
}

export interface ICartProductVariant {
    id?: number,
    stock?: number,
    price: number,
    productId: string,
    color?: IColor,
    memory?: IMemory,
    product?: IProduct
}

export interface ICartResponse {
    message?: string,
    cartItem: ICart
}

export interface IUserCarts {
    carts: ICart[];
    totalItem: number
}