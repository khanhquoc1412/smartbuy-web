<template>
  <div class="account-order">
    <h1 class="order-title">Lịch sử đặt hàng</h1>
    <div class="block-content">
      <div class="content-item">
        <span class="content-item__number"> {{ totalOrders }} </span>
        <span class="content-item__title"> Đơn hàng </span>
      </div>
      <div class="content-item">
        <span class="content-item__number"> {{ formatMoney(totalAmount) }} </span>
        <span class="content-item__title"> Tổng số tiền </span>
      </div>
    </div>
    <div class="block-order">
      <div class="order-status">
        <swiper
          :modules="modules"
          :breakpoints="breakpointOrders"
          :slides-per-view="5"
          :navigation="false"
          :space-between="24"
          id="swiper-slider"
        >
          <swiper-slide
            class="swiper-item"
            :class="{ 'is-active': item.id === currentTab }"
            v-for="item in listOrderStatus"
            :key="item.id"
            @click="handleTabChange(item)"
          >
            <span>
              {{ item.title }}
            </span>
          </swiper-slide>
        </swiper>
      </div>
      <div class="order-main tw-flex tw-gap-3 tw-flex-col" v-if="orderUser">
        <div
          class="order-group"
          v-for="order in orderUser.data"
          :key="order.id"
        >
          <div class="order-group__header tw-flex tw-justify-between">
            <div class="header__left">
              <div class="header__top">
                <span> Mã đơn hàng </span>
                <p>#{{ order.orderNumber || (order._id ? order._id.slice(-4).toUpperCase() : order.id) }}</p>
              </div>
              <div class="header__payment">
                <div class="order-payment--status">
                  {{ order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán' }}
                </div>
                <!-- Order Status Badge -->
                <div class="order-status-badge tw-ml-2 tw-px-3 tw-py-1 tw-rounded-lg tw-text-sm tw-font-medium"
                     :class="getStatusColor(order.status)">
                  {{ getStatusText(order.status) }}
                </div>
                <div class="order-time">
                  <div class="icon">
                    <img :src="calendarIcon" alt="" />
                  </div>
                  <div class="text">
                    {{ formatTime(order.createdAt) }}
                  </div>
                </div>
              </div>
              <!-- Admin Note / Status Note -->
              <div class="order-admin-note tw-mt-2" v-if="order.statusHistory && order.statusHistory.length > 0">
                 <p class="tw-text-sm tw-text-gray-500 tw-italic">
                   <span class="tw-font-medium">Ghi chú:</span> 
                   {{ order.statusHistory[order.statusHistory.length - 1].note }}
                 </p>
              </div>
              <div class="header__bottom">
                <span> Giao tới: </span>
                <p v-if="order.shippingAddress">
                  {{ order.shippingAddress.fullName }} - {{ order.shippingAddress.address }},
                  {{ order.shippingAddress.ward }}, {{ order.shippingAddress.district }},
                  {{ order.shippingAddress.province }}
                </p>
                <p v-else>
                  ---
                </p>
              </div>
            </div>
            <div class="header__right">
              <button 
                class="tw-bg-red tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-font-medium hover:tw-opacity-80 tw-transition-all" 
                v-if="['pending', 'confirmed', 'shipping'].includes(order.status)"
                @click="handleCancelOrder(order._id || order.id)"
              >
                Hủy đơn
              </button>
            </div>
          </div>
          <div class="order-list">
            <OrderItem
              :item="item"
              v-for="item in order.orderItems"
              :key="item._id || item.product"
            />
          </div>
          <div
            class="order-group__bottom tw-flex tw-justify-end tw-gap-2 tw-pt-4 tw-pb-2"
          >
            <span> Tổng thanh toán: </span>
            <span>
              {{ formatMoney(order.totalPrice) }}
            </span>
          </div>
        </div>
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
    pending_payment: 'tw-bg-orange-500 tw-text-white',
    payment_failed: 'tw-bg-red tw-text-white',
    pending: 'tw-bg-amber-500 tw-text-white',
    confirmed: 'tw-bg-blue-600 tw-text-white',
    processing: 'tw-bg-blue-500 tw-text-white',
    ready_to_ship: 'tw-bg-indigo-500 tw-text-white',
    shipping: 'tw-bg-indigo-600 tw-text-white',
    delivered: 'tw-bg-green-500 tw-text-white',
    completed: 'tw-bg-green-600 tw-text-white',
    cancelled: 'tw-bg-gray-600 tw-text-white',
    returned: 'tw-bg-gray-500 tw-text-white'
  };
  return map[status] || 'tw-bg-gray-500 tw-text-white';
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
<style lang="scss">
.account-order {
  display: flex;
  flex-direction: column;
  gap: 30px;

  .order-title {
    font-size: 14px;
    font-weight: 600;
    line-height: 120%;
    text-transform: uppercase;
    padding-bottom: 20px;
    border-bottom: 1px solid $border-section;
  }

  .block-content {
    display: flex;
    justify-content: space-between;
    padding: 20px 20px;
    background-color: $white;
    border-radius: 16px;

    .content-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;

      &:first-child {
        border-right: 1px solid $black;
      }

      &__number {
        padding-bottom: 5px;
        font-size: 18px;
        font-weight: 600;
      }

      &__title {
        font-size: 13px;
        font-weight: 300;
      }
    }
  }

  .block-order {
    display: flex;
    flex-direction: column;
    gap: 16px;

    overflow-x: scroll;

    .order-status {
      width: 100%;
      min-width: 500px;

      .swiper-item {
        background-color: $white;
        padding: 10px;
        display: flex;
        justify-content: center;
        border-radius: 8px;
        border: 1px solid $border-section;
        cursor: pointer;
        transition: color 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);

        &:hover,
        &.is-active {
          color: $red;
          border: 1px solid $red;
          background-color: #fee;
        }
      }
    }

    .order-main {
      width: 100%;
      min-width: 500px;

      .order-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: $white;
        border-radius: 20px;
        padding: 15px 10px;

        &__header {
          display: flex;
          justify-content: space-between;
          gap: 10px;

          .header__left {
            display: flex;
            flex-direction: column;
            gap: 10px;

            .header__top {
              display: flex;
              gap: 5px;

              span {
                font-size: 14px;
                font-weight: 500;
                color: $gray;
              }

              p {
                font-size: 15px;
                font-weight: 600;
                color: $black;
              }
            }

            .header__payment {
              display: flex;
              align-items: center;

              .order-payment--status {
                color: $green;
                background-color: rgba(0, 255, 136, 0.159);
                border-radius: 10px;
                padding: 6px 12px;
              }

              .order-status-badge {
                margin-left: 10px;
                padding: 4px 12px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                color: $white;
              }

              .order-time {
                display: flex;
                justify-content: center;
                align-items: center;
                padding-left: 15px;
                border-left: 1px solid $border-gray-light;
                gap: 10px;

                .icon {
                  height: 18px;
                  width: 18px;

                  img {
                    height: 100%;
                    width: 100%;
                  }
                }

                .text {
                  font-size: 13px;
                  font-weight: 300;
                  font-style: italic;
                  color: $gray;
                }
              }
            }

            .header__bottom {
              display: flex;
              gap: 10px;
              padding: 5px 10px;
              border-radius: 4px;
              background-color: rgba(0, 123, 255, 0.049);

              span {
                font-size: 13px;
                color: $azure;
                font-weight: 500;
              }

              p {
                font-size: 13px;
                font-weight: 600;
              }
            }
          }

          .header__right {
            // Button style moved to template using Tailwind
          }
        }

        .order-list {
          padding-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .order-group__bottom {
          span:nth-child(1) {
            font-size: 14px;
            font-weight: 500;
          }

          span:nth-child(2) {
            font-size: 16px;
            font-weight: 600;
            color: $red;
          }
        }
      }
    }
  }
}
</style>
