import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { unref, toValue, type MaybeRefOrGetter } from "vue";
import {
    createOrder,
    createOrderGuest,
    fetchUserOrders,
    cancelOrder
} from "./order";
import { IOrderInfor, IOrderInforGuest, IOrderParams } from "@/types/order.type";

export const useCreateOrderMutation = () => {
    return useMutation({
        mutationFn: (orderInfo: IOrderInfor) => {
            console.log('🔍 [query.ts] useMutation wrapper called with:', orderInfo);
            console.log('🔍 [query.ts] orderInfo type:', typeof orderInfo);
            console.log('🔍 [query.ts] JSON.stringify:', JSON.stringify(orderInfo));
            return createOrder(orderInfo);
        },
    });
};

export const useCreateOrderGuestMutation = () => {
    return useMutation({
        mutationFn: (orderInfo: IOrderInforGuest) => {
            console.log('🔍 [query.ts GUEST] useMutation wrapper called with:', orderInfo);
            return createOrderGuest(orderInfo);
        },
    });
};

export const useCancelOrderMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: { id: string; reason?: string }) => {
            return cancelOrder(params.id, params.reason);
        },
        onSuccess: () => {
            // Invalidate and refetch order list
            queryClient.invalidateQueries({ queryKey: ["list-orders-user"] });
        }
    });
};

// Type supporting reactive refs
type MaybeRefOrderParams = {
    page?: MaybeRefOrGetter<number | undefined>;
    limit?: MaybeRefOrGetter<number | undefined>;
    status?: MaybeRefOrGetter<string | string[] | undefined>;
    paymentStatus?: MaybeRefOrGetter<string | undefined>;
    startDate?: MaybeRefOrGetter<string | undefined>;
    endDate?: MaybeRefOrGetter<string | undefined>;
};

export const useListOrderUser = (params?: MaybeRefOrderParams) => {
    return useQuery({
        queryKey: ["list-orders-user", () => toValue(params?.page), () => toValue(params?.status)],
        queryFn: () => {
            const statusVal = toValue(params?.status);
            const pageVal = toValue(params?.page) || 1;
            const limitVal = toValue(params?.limit) || 10;

            return fetchUserOrders({
                limit: limitVal,
                page: pageVal,
                status: statusVal
            });
        },
        refetchOnWindowFocus: false,
    });
}