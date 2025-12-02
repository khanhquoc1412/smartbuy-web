<template>
  <div class="payment-result tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-p-4 tw-bg-gray-50">
    <div class="tw-max-w-md tw-w-full">
      <!-- Loading State -->
      <div v-if="isLoading" class="tw-text-center">
        <div class="tw-animate-spin tw-rounded-full tw-h-16 tw-w-16 tw-border-b-2 tw-border-green-500 tw-mx-auto"></div>
        <p class="tw-mt-4 tw-text-gray-600">Đang xử lý kết quả thanh toán...</p>
      </div>

      <!-- Success State -->
      <div v-else class="tw-bg-white tw-rounded-lg tw-shadow-lg tw-p-8">
        <!-- Success Icon -->
        <div class="tw-text-center tw-mb-6">
          <div class="tw-mx-auto tw-flex tw-items-center tw-justify-center tw-h-16 tw-w-16 tw-rounded-full tw-bg-green-100">
            <svg class="tw-h-10 tw-w-10 tw-text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="tw-mt-4 tw-text-2xl tw-font-bold tw-text-gray-900">Thanh toán thành công!</h2>
          <p class="tw-mt-2 tw-text-gray-600">Đơn hàng của bạn đã được xác nhận</p>
        </div>

        <!-- Order Details -->
        <div class="tw-border-t tw-border-gray-200 tw-pt-6">
          <dl class="tw-space-y-4">
            <div class="tw-flex tw-justify-between">
              <dt class="tw-text-sm tw-font-medium tw-text-gray-500">Mã đơn hàng</dt>
              <dd class="tw-text-sm tw-font-semibold tw-text-gray-900">{{ orderNumber }}</dd>
            </div>
            <div class="tw-flex tw-justify-between" v-if="amount">
              <dt class="tw-text-sm tw-font-medium tw-text-gray-500">Số tiền</dt>
              <dd class="tw-text-sm tw-font-semibold tw-text-gray-900">{{ formatCurrency(amount) }}</dd>
            </div>
            <div class="tw-flex tw-justify-between" v-if="transactionNo">
              <dt class="tw-text-sm tw-font-medium tw-text-gray-500">Mã giao dịch</dt>
              <dd class="tw-text-sm tw-font-semibold tw-text-gray-900">{{ transactionNo }}</dd>
            </div>
            <div class="tw-flex tw-justify-between">
              <dt class="tw-text-sm tw-font-medium tw-text-gray-500">Thời gian</dt>
              <dd class="tw-text-sm tw-font-semibold tw-text-gray-900">{{ paymentTime }}</dd>
            </div>
          </dl>
        </div>

        <!-- Actions -->
        <div class="tw-mt-8 tw-space-y-3">
          <router-link
            to="/account/order"
            class="tw-block tw-w-full tw-bg-green-600 tw-text-white tw-text-center tw-py-3 tw-px-4 tw-rounded-lg hover:tw-bg-green-700 tw-transition-colors tw-font-medium"
          >
            Xem đơn hàng
          </router-link>
          <router-link
            to="/"
            class="tw-block tw-w-full tw-bg-gray-100 tw-text-gray-700 tw-text-center tw-py-3 tw-px-4 tw-rounded-lg hover:tw-bg-gray-200 tw-transition-colors tw-font-medium"
          >
            Về trang chủ
          </router-link>
        </div>

        <!-- Thank you message -->
        <p class="tw-mt-6 tw-text-center tw-text-sm tw-text-gray-500">
          Cảm ơn bạn đã mua sắm tại SmartBuy! 🎉
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCart } from '@/composables/useCart';
import { useQueryClient } from '@tanstack/vue-query';

const route = useRoute();
const queryClient = useQueryClient();
const { refetchCart, refetchCartCount } = useCart();
const isLoading = ref(true);
const orderNumber = ref('');
const amount = ref(0);
const transactionNo = ref('');
const paymentTime = ref('');

onMounted(async () => {
  try {
    // Get params from URL query
    const orderId = route.query.orderId as string;
    const vnp_Amount = route.query.vnp_Amount as string;
    const vnp_TransactionNo = route.query.vnp_TransactionNo as string;
    const vnp_PayDate = route.query.vnp_PayDate as string;
    const vnp_BankCode = route.query.vnp_BankCode as string;
    const vnp_CardType = route.query.vnp_CardType as string;

    orderNumber.value = orderId || '';
    transactionNo.value = vnp_TransactionNo || '';

    // Parse amount (VNPay returns amount * 100)
    if (vnp_Amount) {
      amount.value = parseInt(vnp_Amount) / 100;
    }

    // Parse payment time
    let paidAt = new Date();
    if (vnp_PayDate) {
      // Format: yyyyMMddHHmmss -> ISO
      const year = vnp_PayDate.slice(0, 4);
      const month = vnp_PayDate.slice(4, 6);
      const day = vnp_PayDate.slice(6, 8);
      const hour = vnp_PayDate.slice(8, 10);
      const minute = vnp_PayDate.slice(10, 12);
      const second = vnp_PayDate.slice(12, 14);
      paidAt = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
      paymentTime.value = paidAt.toLocaleString('vi-VN');
    } else {
      paymentTime.value = new Date().toLocaleString('vi-VN');
    }

    // Call API to update order status
    if (orderId) {
      try {
        const payload = {
          orderId: orderId,
          paymentStatus: 'paid',
          transactionData: {
            transactionId: vnp_TransactionNo,
            amount: amount.value,
            paidAt: paidAt,
            bankCode: vnp_BankCode,
            cardType: vnp_CardType,
            paymentGateway: 'VNPAY'
          }
        };

        const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/order/payment-callback`;
        
        console.log('🔄 [SUCCESS PAGE] Updating order status...');
        console.log('📤 [SUCCESS PAGE] API URL:', apiUrl);
        console.log('📤 [SUCCESS PAGE] Payload:', JSON.stringify(payload, null, 2));
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log('📥 [SUCCESS PAGE] Response status:', response.status);
        const responseData = await response.json();
        console.log('📥 [SUCCESS PAGE] Response data:', responseData);

        if (!response.ok) {
             console.error('❌ [SUCCESS PAGE] Failed to update order status', responseData);
             showToast('Cảnh báo: Không thể cập nhật trạng thái đơn hàng. Vui lòng kiểm tra lại sau.', 'error');
        } else {
             console.log('✅ [SUCCESS PAGE] Order status updated to PAID');
        }

      } catch (err) {
        console.error('❌ [SUCCESS PAGE] Error updating order status:', err);
        showToast('Lỗi: ' + err.message, 'error');
      }
    } else {
      console.warn('⚠️ [SUCCESS PAGE] No orderId found in query params');
    }

    // ✅ IMPORTANT: Refresh cart count ALWAYS, regardless of order status update result
    // This ensures the cart badge updates immediately when user lands on success page
    console.log('🔄 [SUCCESS PAGE] Refreshing cart to update badge...');
    try {
      // ✅ Wait a bit to ensure backend has finished removing cart items
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ✅ CRITICAL: Remove and invalidate cache FIRST to force fresh data
      console.log('🗑️ [SUCCESS PAGE] Clearing cart cache...');
      queryClient.removeQueries({ queryKey: ['cart'] });
      queryClient.removeQueries({ queryKey: ['cartCount'] });
      
      await queryClient.invalidateQueries({ queryKey: ['cart'], refetchType: 'all' });
      await queryClient.invalidateQueries({ queryKey: ['cartCount'], refetchType: 'all' });
      console.log('✅ [SUCCESS PAGE] Cache cleared and invalidated');
      
      // ✅ Wait a moment for cache to clear
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // ✅ Now refetch to get fresh data from server
      console.log('📥 [SUCCESS PAGE] Fetching fresh cart data...');
      const [cartResult, countResult] = await Promise.all([
        refetchCart(),
        refetchCartCount()
      ]);
      
      console.log('✅ [SUCCESS PAGE] Cart refreshed - badge should update now');
      console.log('📊 Cart items count:', cartResult.data?.itemCount);
      console.log('📊 Cart count API:', countResult.data?.data?.count);
      
      // ✅ Force one more refetch to be absolutely sure
      await new Promise(resolve => setTimeout(resolve, 200));
      await refetchCartCount();
      
    } catch (cartError) {
      console.error('❌ [SUCCESS PAGE] Error refreshing cart:', cartError);
      // Don't fail the page load if cart refresh fails
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 200));
  } catch (error) {
    console.error('Error processing payment result:', error);
  } finally {
    isLoading.value = false;
  }
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};
const showToast = (message: string, type: "success" | "error" = "success") => {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === "success" ? "#4CAF50" : "#f44336"};
    color: white;
    padding: 16px 24px;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-size: 14px;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease";
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
};
</script>

<route lang="yaml">
name: "Payment Success"
meta:
  layout: "default"
</route>

<style scoped>
/* Additional styles if needed */
</style>
