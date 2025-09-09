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
            await orderMutateAsync(orderInfo);
            if (orderData && orderData.value) {
                //Đặt hàng thành công
                router.push("/account/order");
            }
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
            await orderGuestMutateAsync(orderInfo);
            if (orderData && orderData.value) {
                //Order guest thành công
                router.push("/cart/checkout/thank-you");
            }
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