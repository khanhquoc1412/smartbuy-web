import { useCreateOrderMutation, useCreateOrderGuestMutation } from "@/api/order/query";
import { IOrderInfor, IOrderInforGuest } from "@/types/order.type";

export const useOrder = () => {
    const router = useRouter();
    const { start, finish } = useLoading();
    const {
        data: orderData,
        isLoading: isOrderLoading,
        error: orderError,
        mutateAsync: orderMutateAsync,
    } = useCreateOrderMutation();

    const orderProduct = async (orderInfo: IOrderInfor) => {
        start();
        try {
            const response = await orderMutateAsync(orderInfo);
            // Trả về response với cấu trúc { data: Order }
            return response;
        } catch (error) {
            console.error('❌ Order error:', error);
            throw error;
        } finally {
            finish();
        }
    };

    const {
        data: orderGuestData,
        isLoading: isOrderGuestLoading,
        error: orderGuestError,
        mutateAsync: orderGuestMutateAsync,
    } = useCreateOrderGuestMutation();

    const orderProductGuest = async (orderInfo: IOrderInforGuest) => {
        start();
        try {
            const response = await orderGuestMutateAsync(orderInfo);
            // Trả về response với cấu trúc { data: Order }
            return response;
        } catch (error) {
            console.error('❌ Order guest error:', error);
            throw error;
        } finally {
            finish();
        }
    };


    return {
        orderProduct,
        orderData,
        orderError,
        isOrderLoading,
        orderProductGuest,
        orderGuestData,
        orderGuestError,
        isOrderGuestLoading
    };
};