import { ref } from 'vue';
import { useCreatePayment, CreatePaymentPayload } from '@/api/payment/query';

export const usePayment = () => {
  const { mutateAsync: createPaymentMutation, isPending, isError } = useCreatePayment();

  const paymentUrl = ref<string | null>(null);
  const paymentData = ref<any>(null);

  /**
   * Tạo payment và redirect đến payment gateway
   */
  const createAndRedirectPayment = async (payload: CreatePaymentPayload) => {
    try {
      console.log('🔄 Creating payment...', payload);

      const response: any = await createPaymentMutation(payload);
      console.log('✅ Payment API response:', response);

      // Response could be { success, data } or just the data directly
      const responseData: any = response?.success !== undefined ? response : { success: true, data: response };

      if (!responseData.success) {
        throw new Error(responseData.message || 'Tạo thanh toán thất bại');
      }

      paymentData.value = responseData.data;

      // Nếu có paymentUrl (VNPAY, MOMO, etc.) → redirect
      if (responseData.data?.paymentUrl) {
        paymentUrl.value = responseData.data.paymentUrl;
        console.log('✅ Payment URL:', paymentUrl.value);

        // Redirect sang payment gateway
        if (paymentUrl.value) {
          window.location.href = paymentUrl.value;
        }
        return { success: true, data: responseData.data };
      }

      // Nếu COD → không cần redirect
      if (payload.paymentMethod === 'COD') {
        console.log('✅ COD payment created successfully');
        return { success: true, data: responseData.data, message: 'Đơn hàng COD được tạo thành công' };
      }

      return { success: true, data: responseData.data };
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      throw error;
    }
  };

  /**
   * Tạo payment cho VNPAY
   */
  const createVNPayPayment = async (
    orderId: string,
    userId: string,
    amount: number,
    customerInfo: { name: string; phone: string; email?: string },
    bankCode?: string
  ) => {
    return createAndRedirectPayment({
      orderId,
      userId,
      amount,
      paymentMethod: 'VNPAY',
      customerInfo,
      description: `Thanh toán đơn hàng ${orderId}`,
      bankCode,
    });
  };

  /**
   * Tạo payment cho COD
   */
  const createCODPayment = async (
    orderId: string,
    userId: string,
    amount: number,
    customerInfo: { name: string; phone: string; email?: string }
  ) => {
    return createAndRedirectPayment({
      orderId,
      userId,
      amount,
      paymentMethod: 'COD',
      customerInfo,
      description: `Thanh toán khi nhận hàng - Đơn ${orderId}`,
    });
  };

  return {
    // Methods
    createAndRedirectPayment,
    createVNPayPayment,
    createCODPayment,

    // States
    paymentUrl,
    paymentData,
    isLoading: isPending,
    isError,
  };
};
