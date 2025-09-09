import {
    useMutation,
    useQuery,
} from "vue-query";
import {
    createOrder,
    createOrderGuest,
    fetchUserOrders
} from "./order";
import { IOrderInfor, IOrderInforGuest } from "@/types/order.type";
import { IParams } from "@/types/product.types";

export const useCreateOrderMutation = () => {
    return useMutation(
        ["create-order-user"],
        (orderInfor: IOrderInfor) => createOrder(orderInfor)
    );
};

export const useCreateOrderGuestMutation = () => {
    return useMutation(
        ["create-order-user-guest"],
        (orderInfor: IOrderInforGuest) => createOrderGuest(orderInfor)
    );
};

export const useListOrderUser = (params?: IParams) => {

    return useQuery(["list-orders-user", params?.page], () =>
        fetchUserOrders({
            limit: params?.limit || 10,
            page: 1
        }),
        {
            refetchOnWindowFocus: false,
        }
    );
}