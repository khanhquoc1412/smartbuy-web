<template>
  <div class="thank-you-page">
    <div class="thank-you-container">
      <!-- Success Animation -->
      <div class="success-animation">
        <div class="checkmark-circle">
          <svg class="checkmark" viewBox="0 0 52 52">
            <circle class="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
      </div>

      <!-- Thank You Message -->
      <div class="message-container">
        <h1 class="title">Đặt hàng thành công!</h1>
        <p class="subtitle">Cảm ơn bạn đã mua hàng tại SmartBuy</p>
      </div>

      <!-- Order Info -->
      <div class="order-info" v-if="orderNumber">
        <div class="info-row">
          <span class="label">Mã đơn hàng:</span>
          <span class="value">#{{ orderNumber }}</span>
        </div>
        <div class="info-row">
          <span class="label">Trạng thái:</span>
          <span class="value status">Đang xử lý</span>
        </div>
      </div>

      <!-- Success Details -->
      <div class="details-card">
        <div class="detail-item">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <div class="detail-text">
            <h3>Email xác nhận</h3>
            <p>Chúng tôi đã gửi email xác nhận đơn hàng</p>
          </div>
        </div>

        <div class="detail-item">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div class="detail-text">
            <h3>Xử lý đơn hàng</h3>
            <p>Đơn hàng của bạn đang được xử lý</p>
          </div>
        </div>

        <div class="detail-item">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div class="detail-text">
            <h3>Theo dõi đơn hàng</h3>
            <p>Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi"</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <router-link to="/account/order" class="btn btn-primary">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          Xem đơn hàng
        </router-link>
        <router-link to="/" class="btn btn-secondary">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          Về trang chủ
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCart } from '@/composables/useCart';
import { useQueryClient } from '@tanstack/vue-query';

const route = useRoute();
const queryClient = useQueryClient();
const { refetchCart, refetchCartCount } = useCart();
const orderNumber = ref<string>('');

onMounted(async () => {
  const orderId = route.query.orderId as string || '';
  orderNumber.value = route.query.orderNumber as string || '';
  
  // ✅ IMPORTANT: Refresh cart count to update badge after COD order
  console.log('🔄 [THANK-YOU PAGE] Refreshing cart to update badge...');
  try {
    // ✅ Wait a bit to ensure backend has finished removing cart items
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // ✅ CRITICAL: Remove and invalidate cache FIRST to force fresh data
    console.log('🗑️ [THANK-YOU PAGE] Clearing cart cache...');
    queryClient.removeQueries({ queryKey: ['cart'] });
    queryClient.removeQueries({ queryKey: ['cartCount'] });
    
    await queryClient.invalidateQueries({ queryKey: ['cart'], refetchType: 'all' });
    await queryClient.invalidateQueries({ queryKey: ['cartCount'], refetchType: 'all' });
    console.log('✅ [THANK-YOU PAGE] Cache cleared and invalidated');
    
    // ✅ Wait a moment for cache to clear
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // ✅ Now refetch to get fresh data from server
    console.log('📥 [THANK-YOU PAGE] Fetching fresh cart data...');
    const [cartResult, countResult] = await Promise.all([
      refetchCart(),
      refetchCartCount()
    ]);
    
    console.log('✅ [THANK-YOU PAGE] Cart refreshed - badge should update now');
    console.log('📊 Cart items count:', cartResult.data?.itemCount);
    console.log('📊 Cart count API:', countResult.data?.data?.count);
    
    // ✅ Force one more refetch to be absolutely sure
    await new Promise(resolve => setTimeout(resolve, 200));
    await refetchCartCount();
    
  } catch (cartError) {
    console.error('❌ [THANK-YOU PAGE] Error refreshing cart:', cartError);
    // Don't fail the page load if cart refresh fails
  }
});
</script>

<route lang="yaml">
name: Thank you
meta:
  layout: "cartLayout"
</route>

<style scoped lang="scss">
.thank-you-page {
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 15px;
}

.thank-you-container {
  max-width: 500px;
  width: 100%;
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Success Animation */
.success-animation {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.checkmark-circle {
  width: 80px;
  height: 80px;
  position: relative;
  animation: scaleIn 0.4s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.checkmark {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.checkmark-circle-bg {
  stroke: #4CAF50;
  stroke-width: 2;
  fill: #E8F5E9;
  animation: circleDraw 0.6s ease-out;
}

@keyframes circleDraw {
  from {
    stroke-dasharray: 0 157;
  }
  to {
    stroke-dasharray: 157 157;
  }
}

.checkmark-check {
  stroke: #4CAF50;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: checkmarkDraw 0.4s ease-out 0.4s forwards;
}

@keyframes checkmarkDraw {
  to {
    stroke-dashoffset: 0;
  }
}

/* Message Container */
.message-container {
  text-align: center;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
}

/* Order Info */
.order-info {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #e9ecef;
  }
}

.label {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

.value {
  font-size: 15px;
  color: #2c3e50;
  font-weight: 600;

  &.status {
    color: #FF9800;
    background: #FFF3E0;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 13px;
  }
}

/* Details Card */
.details-card {
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #e9ecef;
  }

  .icon {
    width: 24px;
    height: 24px;
    color: #667eea;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .detail-text {
    flex: 1;

    h3 {
      font-size: 15px;
      font-weight: 600;
      color: #2c3e50;
      margin: 0 0 5px 0;
    }

    p {
      font-size: 13px;
      color: #7f8c8d;
      margin: 0;
      line-height: 1.5;
    }
  }
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 12px;
  flex-direction: column;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover {
    background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
  }
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;

  &:hover {
    background: #f8f9ff;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .thank-you-container {
    padding: 20px 15px;
  }

  .title {
    font-size: 20px;
  }

  .subtitle {
    font-size: 13px;
  }

  .checkmark-circle {
    width: 70px;
    height: 70px;
  }
}
</style>