import { IAddress } from "./address.type";
import { ICart } from "./cart.types";
import { IPayment } from "./payment.type";
import { IProductVariant } from "./product.types";

export interface IOrderInfor {
    carts: ICart[],
    address?: IAddress,
    userAddressId?: string,
    paymentId: number,
    userName?: string,
    phoneNumber?: string
}
export interface IOrderInforGuest {
    productVariantId: number | string,
    address?: IAddress,
    paymentId: number,
    userName?: string,
    phoneNumber?: string,
}
export interface IOrder {
    id: number | string,
    userName: string,
    phoneNumber: string,
    orderStatus: IOrderStatus,
    payment: IPayment,
    address: IAddress,
    orderDetails: IOrderDetail[],
    createdAt: string
}
export interface IOrderDetail {
    id: number | string,
    quantity: number,
    orderId?: number,
    productVariant: IProductVariant
}
export interface IOrderListResponse {
    orders: IOrder[],
    total?: number;
    skip?: number;
    totalOrder?: number;
    limit: number;
    page: number
}

export interface IOrderStatus {
    id?: string | number,
    name?: string
}