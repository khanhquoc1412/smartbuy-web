import { IOrderInfor, IOrderInforGuest, IOrderListResponse } from "@/types/order.type";
import { IParams } from "@/types/product.types";
import { $axios } from "@plugins/axios/axios";

export const createOrder = (orderInfor: IOrderInfor) => {
    return $axios.post<unknown, unknown>(`/orders/create`, orderInfor);
};


export const fetchUserOrders = (params?: IParams) => {
    return $axios.get<unknown, IOrderListResponse>(`/orders/list`, {
        params,
    });
};

export const createOrderGuest = (orderInfor: IOrderInforGuest) => {
    return $axios.post<unknown, unknown>(`/orders/create-order-guest`, orderInfor);
};

