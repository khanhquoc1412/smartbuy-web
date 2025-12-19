<template>
  <div class="payment-result tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-p-4 tw-bg-gray-50">
    <div class="tw-max-w-md tw-w-full">
      <!-- Loading State -->
      <div v-if="isLoading" class="tw-text-center">
        <div class="tw-animate-spin tw-rounded-full tw-h-16 tw-w-16 tw-border-b-2 tw-border-red-500 tw-mx-auto"></div>
        <p class="tw-mt-4 tw-text-gray-600">Đang xử lý kết quả thanh toán...</p>
      </div>

      <!-- Failed State -->
      <div v-else class="tw-bg-white tw-rounded-lg tw-shadow-lg tw-p-8">
        <!-- Failed Icon -->
        <div class="tw-text-center tw-mb-6">
          <div class="tw-mx-auto tw-flex tw-items-center tw-justify-center tw-h-16 tw-w-16 tw-rounded-full tw-bg-red-100">
            <svg class="tw-h-10 tw-w-10 tw-text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 class="tw-mt-4 tw-text-2xl tw-font-bold tw-text-gray-900">
            {{ isCancelled ? 'Đã hủy thanh toán' : 'Thanh toán thất bại' }}
          </h2>
          <p class="tw-mt-2 tw-text-gray-600">{{ errorMessage }}</p>
        </div>

        <!-- Error Details -->
        <div class="tw-border-t tw-border-gray-200 tw-pt-6">
          <dl class="tw-space-y-4">
            <div class="tw-flex tw-justify-between" v-if="orderNumber">
              <dt class="tw-text-sm tw-font-medium tw-text-gray-500">Mã đơn hàng</dt>
              <dd class="tw-text-sm tw-font-semibold tw-text-gray-900">{{ orderNumber }}</dd>
            </div>
            <div class="tw-flex tw-justify-between" v-if="responseCode">
              <dt class="tw-text-sm tw-font-medium tw-text-gray-500">Mã lỗi</dt>
              <dd class="tw-text-sm tw-font-semibold tw-text-red-600">{{ responseCode }}</dd>
            </div>
            <div class="tw-flex tw-justify-between">
              <dt class="tw-text-sm tw-font-medium tw-text-gray-500">Thời gian</dt>
              <dd class="tw-text-sm tw-font-semibold tw-text-gray-900">{{ paymentTime }}</dd>
            </div>
          </dl>
        </div>

        <!-- Reason -->
        <div v-if="failureReason" class="tw-mt-6 tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-lg tw-p-4">
          <p class="tw-text-sm tw-text-red-800">
            <strong>Lý do:</strong> {{ failureReason }}
          </p>
        </div>

        <!-- Actions -->
        <div class="tw-mt-8 tw-space-y-3">
          <button
            @click="retryPayment"
            class="tw-block tw-w-full tw-bg-red-600 tw-text-white tw-text-center tw-py-3 tw-px-4 tw-rounded-lg hover:tw-bg-red-700 tw-transition-colors tw-font-medium"
          >
            Thử lại thanh toán
          </button>
          <router-link
            to="/account/order"
            class="tw-block tw-w-full tw-bg-gray-100 tw-text-gray-700 tw-text-center tw-py-3 tw-px-4 tw-rounded-lg hover:tw-bg-gray-200 tw-transition-colors tw-font-medium"
          >
            Xem đơn hàng
          </router-link>
          <router-link
            to="/"
            class="tw-block tw-w-full tw-bg-white tw-text-gray-700 tw-text-center tw-py-3 tw-px-4 tw-rounded-lg tw-border tw-border-gray-300 hover:tw-bg-gray-50 tw-transition-colors tw-font-medium"
          >
            Về trang chủ
          </router-link>
        </div>

        <!-- Contact support -->
        <p class="tw-mt-6 tw-text-center tw-text-sm tw-text-gray-500">
          Nếu cần hỗ trợ, vui lòng liên hệ hotline: <strong>1900.9999</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const orderNumber = ref('');
const responseCode = ref('');
const paymentTime = ref('');
const errorMessage = ref('Giao dịch không thành công. Vui lòng thử lại.');

// VNPay response code messages
const vnpayMessages: Record<string, string> = {
  '07': 'Trừ tiền thành công nhưng giao dịch bị nghi ngờ (liên quan tới lừa đảo)',
  '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ Internet Banking',
  '10': 'Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
  '11': 'Đã hết hạn chờ thanh toán',
  '12': 'Thẻ/Tài khoản bị khóa',
  '13': 'Sai mật khẩu xác thực giao dịch (OTP)',
  '24': 'Bạn đã hủy giao dịch',
  '51': 'Tài khoản không đủ số dư để thanh toán',
  '65': 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày',
  '75': 'Ngân hàng thanh toán đang bảo trì',
  '79': 'Nhập sai mật khẩu thanh toán quá số lần quy định',
  '99': 'Lỗi không xác định',
};

const isCancelled = computed(() => responseCode.value === '24');

const failureReason = computed(() => {
  if (responseCode.value) {
    return vnpayMessages[responseCode.value] || vnpayMessages['99'];
  }
  return route.query.message as string || '';
});

onMounted(async () => {
  try {
    // Get params from URL query
    const orderId = route.query.orderId as string;
    const code = route.query.code as string;
    const message = route.query.message as string;

    orderNumber.value = orderId || '';
    responseCode.value = code || '';

    // Set error message
    if (message) {
      errorMessage.value = message;
    } else if (code === '24') {
      errorMessage.value = 'Bạn đã hủy thanh toán';
    } else if (code) {
      errorMessage.value = vnpayMessages[code] || 'Giao dịch thất bại';
    }

    paymentTime.value = new Date().toLocaleString('vi-VN');

    // ✅ NEW: Call API to cancel order
    if (orderId) {
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/order/payment-callback`;
        
        console.log('🔄 [FAILED PAGE] Cancelling order...');
        console.log('📤 [FAILED PAGE] API URL:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: orderId,
            paymentStatus: 'failed',
            transactionData: {
              responseCode: code || '99',
              responseMessage: errorMessage.value
            }
          })
        });

        console.log('📥 [FAILED PAGE] Response status:', response.status);
        const responseData = await response.json();
        console.log('📥 [FAILED PAGE] Response data:', responseData);

        if (response.ok) {
          console.log('✅ [FAILED PAGE] Order cancelled successfully');
          // ✅ Show toast notification to user
          setTimeout(() => {
            alert('⚠️ Đơn hàng đã được hủy do thanh toán thất bại. Vui lòng đặt lại đơn hàng khác!');
          }, 500);
        } else {
          console.error('❌ [FAILED PAGE] Failed to cancel order', responseData);
        }
      } catch (err) {
        console.error('❌ [FAILED PAGE] Error cancelling order:', err);
      }
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error('Error processing payment result:', error);
  } finally {
    isLoading.value = false;
  }
});

const retryPayment = () => {
  if (orderNumber.value) {
    // Redirect back to cart or order page to retry
    router.push('/cart');
  } else {
    router.push('/');
  }
};
</script>

<route lang="yaml">
name: "Payment Failed"
meta:
  layout: "default"
</route>

<style scoped>
/* Additional styles if needed */
</style>
