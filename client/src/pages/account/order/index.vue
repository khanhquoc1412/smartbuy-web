<template>
  <div class="account-order">
    <h1 class="order-title">Lịch sử đặt hàng</h1>
    
    <!-- Summary Stats -->
    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-number">{{ totalOrders }}</span>
          <span class="stat-label">Đơn hàng</span>
        </div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-number">{{ formatMoney(totalAmount) }}</span>
          <span class="stat-label">Tổng chi tiêu</span>
        </div>
      </div>
    </div>

    <div class="block-order">
      <!-- Status Tabs -->
      <div class="order-status">
        <swiper
          :modules="modules"
          :breakpoints="breakpointOrders"
          :slides-per-view="5"
          :navigation="false"
          :space-between="12"
          id="swiper-slider"
          class="status-swiper"
        >
          <swiper-slide
            class="swiper-item"
            :class="{ 'is-active': item.id === currentTab }"
            v-for="item in listOrderStatus"
            :key="item.id"
            @click="handleTabChange(item)"
          >
            <span>{{ item.title }}</span>
          </swiper-slide>
        </swiper>
      </div>

      <!-- Order List -->
      <div class="order-main" v-if="orderUser">
        <transition-group name="list" tag="div" class="tw-flex tw-gap-4 tw-flex-col">
          <div
            class="order-card"
            v-for="order in orderUser.data"
            :key="order.id"
          >
            <!-- Card Header -->
            <div class="card-header">
              <div class="header-top">
                <div class="order-id-wrapper">
                  <span class="label">Đơn hàng</span>
                  <span class="id">#{{ order.orderNumber || 'N/A' }}</span>
                </div>
                <div class="order-date">
                  <img :src="calendarIcon" alt="" class="icon" />
                  <span>{{ formatTime(order.createdAt) }}</span>
                </div>
              </div>
              
              <div class="header-status">
                <div class="payment-status" :class="order.paymentStatus === 'paid' ? 'paid' : 'unpaid'">
                  {{ order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán' }}
                </div>
                <div class="status-badge" :class="getStatusColor(order.status)">
                  {{ getStatusText(order.status) }}
                </div>
              </div>
            </div>

            <!-- Admin Note -->
            <div class="order-note" v-if="order.statusHistory && order.statusHistory.length > 0">
              <div class="note-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p>
                <span class="note-label">Ghi chú:</span> 
                {{ order.statusHistory[order.statusHistory.length - 1].note }}
              </p>
            </div>

            <!-- Shipping Info -->
            <div class="shipping-info">
              <div class="shipping-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div class="shipping-text">
                <span class="label">Giao tới:</span>
                <p v-if="order.shippingAddress">
                  {{ order.shippingAddress.fullName }} • {{ order.shippingAddress.phone }} <br/>
                  <span class="address-detail">
                    {{ order.shippingAddress.address }}, {{ order.shippingAddress.ward }}, {{ order.shippingAddress.district }}, {{ order.shippingAddress.province }}
                  </span>
                </p>
                <p v-else>---</p>
              </div>
            </div>

            <!-- Order Items -->
            <div class="order-items">
              <OrderItem
                :item="item"
                v-for="item in order.orderItems"
                :key="item._id || item.product"
              />
            </div>

            <!-- Card Footer -->
            <div class="card-footer">
              <div class="footer-left">
                <button 
                  class="btn-cancel" 
                  v-if="['pending_payment', 'pending', 'confirmed', 'processing', 'ready_to_ship'].includes(order.status)"
                  @click="handleCancelOrder(order._id || order.id)"
                >
                  Hủy đơn hàng
                </button>
              </div>
              <div class="footer-right">
                <span class="total-label">Tổng thanh toán:</span>
                <span class="total-price">{{ formatMoney(order.totalPrice) }}</span>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import calendarIcon from "@assets/svg/calendar.svg";
import { breakpointOrders } from "@utils/breackpoints";
import {
  Swiper,
  SwiperSlide,
} from "swiper/vue";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCube,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cube";
import { SwiperModule } from "swiper/types";
import OrderItem from "@/components/cart/OrderItem.vue";
import { useListOrderUser, useCancelOrderMutation } from "@/api/order/query";
import { formatTime } from "@utils/formatTime";
import { getTotalAmount } from "@/utils/product/getTotalPrice";
import { formatMoney } from "@/utils/formatMoney";

const modules: SwiperModule[] = [Navigation, Pagination, Autoplay, EffectCube];

interface IOrderStatus {
  id: number;
  title: string;
  value?: string | string[]; // Hỗ trợ cả string và array
}

const listOrderStatus: IOrderStatus[] = [
  { 
    id: 0, 
    title: "Tất cả", 
    value: undefined 
  },
  { 
    id: 1, 
    title: "Chờ xác nhận", 
    value: ["pending_payment", "payment_failed", "pending"] 
  },
  { 
    id: 2, 
    title: "Đã xác nhận", 
    value: ["confirmed", "processing", "ready_to_ship"] 
  },
  { 
    id: 3, 
    title: "Đang giao hàng", 
    value: ["shipping"] 
  },
  { 
    id: 4, 
    title: "Đã giao hàng", 
    value: ["delivered", "completed"] 
  },
  { 
    id: 5, 
    title: "Đã hủy", 
    value: ["cancelled", "returned"] 
  },
];

const currentTab = ref(0);

const currentStatus = computed(() => {
  const tab = listOrderStatus.find(t => t.id === currentTab.value);
  return tab?.value;
});

const { data: orderUser, refetch, isLoading, isFetching } = useListOrderUser({
  page: 1,
  limit: 10,
  status: currentStatus as any // Pass computed status
});

const { mutate: cancelOrderMutate } = useCancelOrderMutation();

const handleCancelOrder = (orderId: string) => {
  if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
    cancelOrderMutate(orderId, {
      onSuccess: () => {
        showToast("Hủy đơn hàng thành công!", "success");
        refetch();
      },
      onError: (error) => {
        console.error("Failed to cancel order:", error);
        showToast("Có lỗi xảy ra khi hủy đơn hàng.", "error");
      }
    });
  }
};

// Computed properties for totals
const totalOrders = computed(() => {
  return orderUser.value?.pagination?.total || 0;
});

const totalAmount = computed(() => {
  if (!orderUser.value?.data) return 0;
  return orderUser.value.data.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
});

const handleTabChange = (item: IOrderStatus) => {
  currentTab.value = item.id;
  // useQuery is reactive, it will refetch automatically when params change
};

// Helper to get status text
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending_payment: 'Chờ thanh toán',
    payment_failed: 'Thanh toán thất bại',
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    processing: 'Đang chuẩn bị hàng',
    ready_to_ship: 'Sẵn sàng giao hàng',
    shipping: 'Đang giao hàng',
    delivered: 'Đã giao hàng',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
    returned: 'Đã trả hàng'
  };
  return map[status] || status;
};

// Helper to get status color class
const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    pending_payment: 'status-orange',
    payment_failed: 'status-red',
    pending: 'status-amber',
    confirmed: 'status-blue',
    processing: 'status-blue',
    ready_to_ship: 'status-indigo',
    shipping: 'status-indigo',
    delivered: 'status-green',
    completed: 'status-green',
    cancelled: 'status-gray',
    returned: 'status-gray'
  };
  return map[status] || 'status-gray';
};

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
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
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
};

console.log('Current orders:', orderUser);
</script>

<route lang="yaml">
name: Đơn đặt hàng
meta:
  requiresAuth: true
  layout: "accountLayout"
</route>

<style lang="scss" scoped>
.account-order {
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: 'Inter', sans-serif;

  .order-title {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;
    padding-bottom: 16px;
    border-bottom: 1px solid #e5e7eb;
  }

  /* Stats Container */
  .stats-container {
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 24px;
    color: white;
    box-shadow: 0 10px 25px rgba(118, 75, 162, 0.2);
    position: relative;
    overflow: hidden;



    .stat-card {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      position: relative;
      z-index: 1;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        width: 24px;
        height: 24px;
        color: white;
      }
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 24px;
      font-weight: 700;
      line-height: 1.2;
    }

    .stat-label {
      font-size: 14px;
      opacity: 0.9;
      font-weight: 400;
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: rgba(255, 255, 255, 0.3);
      margin: 0 20px;
    }
  }

  .block-order {
    display: flex;
    flex-direction: column;
    gap: 20px;

    /* Status Tabs */
    .order-status {
      width: 100%;
      
      .status-swiper {
        padding: 4px;
      }

      .swiper-item {
        background-color: #f3f4f6;
        padding: 10px 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 99px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        font-weight: 500;
        color: #6b7280;
        border: 1px solid transparent;

        &:hover {
          background-color: #e5e7eb;
          color: #374151;
        }

        &.is-active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
      }
    }

    /* Order List */
    .order-main {
      width: 100%;

      .order-card {
        background: white;
        border-radius: 16px;
        padding: 16px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
        border: 1px solid #f0f0f0;
        transition: all 0.3s ease;

        &:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
          transform: translateY(-5px);
        }

        /* Card Header */
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #f3f4f6;

          .header-top {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .order-id-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;

            .label {
              font-size: 13px;
              color: #6b7280;
            }

            .id {
              font-size: 16px;
              font-weight: 700;
              color: #111827;
            }
          }

          .order-date {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            color: #9ca3af;

            .icon {
              width: 14px;
              height: 14px;
              opacity: 0.6;
            }
          }

          .header-status {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 8px;
          }

          .payment-status {
            font-size: 12px;
            padding: 4px 10px;
            border-radius: 6px;
            font-weight: 500;

            &.paid {
              background-color: #ecfdf5;
              color: #059669;
            }

            &.unpaid {
              background-color: #fff7ed;
              color: #d97706;
            }
          }

          .status-badge {
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            
            &.status-orange { background-color: #fff7ed; color: #c2410c; }
            &.status-red { background-color: #fef2f2; color: #dc2626; }
            &.status-amber { background-color: #fffbeb; color: #b45309; }
            &.status-blue { background-color: #eff6ff; color: #2563eb; }
            &.status-indigo { background-color: #eef2ff; color: #4f46e5; }
            &.status-green { background-color: #f0fdf4; color: #16a34a; }
            &.status-gray { background-color: #f3f4f6; color: #4b5563; }
          }
        }

        /* Note */
        .order-note {
          background-color: #f8fafc;
          border-left: 3px solid #667eea;
          padding: 10px 14px;
          border-radius: 4px;
          margin-bottom: 16px;
          display: flex;
          gap: 10px;
          align-items: flex-start;

          .note-icon {
            color: #667eea;
            width: 16px;
            height: 16px;
            margin-top: 2px;
            
            svg { width: 100%; height: 100%; }
          }

          p {
            font-size: 13px;
            color: #475569;
            margin: 0;
            line-height: 1.5;
          }

          .note-label {
            font-weight: 600;
            color: #334155;
          }
        }

        /* Shipping Info */
        .shipping-info {
          display: flex;
          gap: 12px;
          padding: 12px;
          background-color: #f9fafb;
          border-radius: 8px;
          margin-bottom: 12px;

          .shipping-icon {
            color: #9ca3af;
            width: 20px;
            height: 20px;
            
            svg { width: 100%; height: 100%; }
          }

          .shipping-text {
            font-size: 14px;
            color: #374151;

            .label {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 2px;
              display: block;
            }

            p {
              margin: 0;
              line-height: 1.5;
              font-weight: 500;
            }

            .address-detail {
              font-weight: 400;
              color: #6b7280;
              font-size: 13px;
            }
          }
        }

        /* Order Items */
        .order-items {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 12px;
        }

        /* Footer */
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid #f3f4f6;

          .footer-left {
            .btn-cancel {
              padding: 8px 16px;
              border-radius: 8px;
              font-size: 13px;
              font-weight: 500;
              color: #ef4444;
              background-color: white;
              border: 1px solid #fee2e2;
              transition: all 0.2s;

              &:hover {
                background-color: #fef2f2;
                border-color: #fecaca;
              }
            }
          }

          .footer-right {
            display: flex;
            align-items: center;
            gap: 10px;

            .total-label {
              font-size: 14px;
              color: #6b7280;
            }

            .total-price {
              font-size: 18px;
              font-weight: 700;
              color: #dc2626;
            }
          }
        }
      }
    }
  }
}

/* List Transition */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
