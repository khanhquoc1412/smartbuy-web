import { useMutation, useQuery } from '@tanstack/vue-query';
import { _axios } from '@/plugins/axios/axios';

// ============ TYPES ============
export interface CreatePaymentPayload {
  orderId: string;
  userId: string;
  amount: number;
  paymentMethod: 'COD' | 'VNPAY' | 'MOMO' | 'ZALOPAY';
  customerInfo?: {
    name: string;
    email?: string;
    phone: string;
  };
  description?: string;
  bankCode?: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    orderId: string;
    userId: string;
    amount: number;
    paymentMethod: string;
    status: string;
    transactionId: string;
    paymentUrl?: string;
    expiresAt: string;
    createdAt: string;
  };
}

// ============ API FUNCTIONS ============

/**
 * Tạo payment và lấy payment URL
 */
const createPayment = async (payload: CreatePaymentPayload): Promise<PaymentResponse> => {
  const response = await _axios.post('/api/payments/create', payload);
  return response.data;
};

/**
 * Lấy thông tin payment theo ID
 */
const getPaymentById = async (paymentId: string): Promise<PaymentResponse> => {
  const response = await _axios.get(`/api/payments/${paymentId}`);
  return response.data;
};

/**
 * Lấy payment theo orderId
 */
const getPaymentByOrderId = async (orderId: string): Promise<PaymentResponse> => {
  const response = await _axios.get(`/api/payments/order/${orderId}`);
  return response.data;
};

/**
 * Hủy payment
 */
const cancelPayment = async (paymentId: string, reason?: string): Promise<PaymentResponse> => {
  const response = await _axios.post(`/api/payments/${paymentId}/cancel`, { reason });
  return response.data;
};

// ============ REACT QUERY HOOKS ============

/**
 * Hook: Tạo payment
 */
export const useCreatePayment = () => {
  return useMutation({
    mutationFn: createPayment,
    onSuccess: (data) => {
      console.log('✅ Payment created:', data);
    },
    onError: (error: any) => {
      console.error('❌ Create payment error:', error);
    },
  });
};

/**
 * Hook: Lấy payment theo ID
 */
export const useGetPayment = (paymentId: string, enabled = true) => {
  return useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => getPaymentById(paymentId),
    enabled: !!paymentId && enabled,
  });
};

/**
 * Hook: Lấy payment theo orderId
 */
export const useGetPaymentByOrderId = (orderId: string, enabled = true) => {
  return useQuery({
    queryKey: ['payment-order', orderId],
    queryFn: () => getPaymentByOrderId(orderId),
    enabled: !!orderId && enabled,
  });
};

/**
 * Hook: Hủy payment
 */
export const useCancelPayment = () => {
  return useMutation({
    mutationFn: ({ paymentId, reason }: { paymentId: string; reason?: string }) =>
      cancelPayment(paymentId, reason),
    onSuccess: (data) => {
      console.log('✅ Payment cancelled:', data);
    },
    onError: (error: any) => {
      console.error('❌ Cancel payment error:', error);
    },
  });
};
