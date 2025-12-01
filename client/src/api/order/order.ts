import { IOrderInfor, IOrderInforGuest, IOrderListResponse, IOrderParams } from "@/types/order.type";
import { $axios } from "@plugins/axios/axios";

export const createOrder = (orderInfor: IOrderInfor) => {
    console.log('🔍 [order.ts] createOrder called with:', orderInfor);
    console.log('🔍 [order.ts] orderInfor type:', typeof orderInfor);
    console.log('🔍 [order.ts] JSON.stringify:', JSON.stringify(orderInfor));
    // Route to orderservice (port 3002) endpoint
    return $axios.post<unknown, unknown>(`/order/create`, orderInfor);
};


export const fetchUserOrders = (params?: IOrderParams) => {
    // Route to orderservice (port 3002) endpoint
    return $axios.get<unknown, IOrderListResponse>(`/order/list`, {
        params,
    });
};

export const createOrderGuest = (orderInfor: IOrderInforGuest) => {
    // Route to orderservice guest endpoint
    return $axios.post<unknown, unknown>(`/order/create-order-guest`, orderInfor);
};

export const cancelOrder = (orderId: string, reason?: string) => {
    return $axios.patch<unknown, unknown>(`/order/${orderId}/cancel`, { reason });
};

