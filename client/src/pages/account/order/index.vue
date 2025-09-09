<template>
    <div class="account-order">
        <h1 class="order-title">Lịch sử đặt hàng</h1>
        <div class="block-content">
            <div class="content-item">
                <span class="content-item__number">
                    0
                </span>
                <span class="content-item__title">
                    Đơn hàng
                </span>
            </div>
            <div class="content-item">
                <span class="content-item__number">
                    0đ
                </span>
                <span class="content-item__title">
                    Tổng số tiền
                </span>
            </div>
        </div>
        <div class="block-order">
            <div class="order-status">
                <swiper :modules="modules" :breakpoints="breakpointOrders" :slides-per-view="5" :navigation="false"
                    :space-between="24" id="swiper-slider">
                    <swiper-slide class="swiper-item" :class="{ 'is-active': item.id === 1 }"
                        v-for="item in listOrderStatus" :key="item.id">
                        <span>
                            {{ item.title }}
                        </span>
                    </swiper-slide>
                </swiper>
            </div>
            <div class="order-main tw-flex tw-gap-3 tw-flex-col" v-if="orderUser">
                <div class="order-group" v-for="order in orderUser.orders" :key="order.id">
                    <div class="order-group__header tw-flex tw-justify-between">
                        <div class="header__left">
                            <div class="header__top">
                                <span>
                                    Mã đơn hàng
                                </span>
                                <p>
                                    #{{ order.id }}
                                </p>
                            </div>
                            <div class="header__payment">
                                <div class="order-payment--status">
                                    {{ order.payment.paymentStatus.name }}
                                </div>
                                <div class="order-time">
                                    <div class="icon">
                                        <img :src="calendarIcon" alt="">
                                    </div>
                                    <div class="text">
                                        {{ formatTime(order.createdAt) }}
                                    </div>
                                </div>
                            </div>
                            <div class="header__bottom">
                                <span>
                                    Giao tới:
                                </span>
                                <p>
                                    {{ order.userName }} - {{ order.address.houseNumber }} {{ order.address.ward }} - {{
                                        order.address.district }}
                                    - {{ order.address.province }}
                                </p>
                            </div>
                        </div>
                        <div class="header__right">
                            <button class="order-btn--cancel">
                                Hủy đơn
                            </button>
                        </div>
                    </div>
                    <div class="order-list">
                        <OrderItem :item="item" v-for="item in order.orderDetails" :key="item.id" />
                    </div>
                    <div class="order-group__bottom tw-flex tw-justify-end tw-gap-2 tw-pt-4 tw-pb-2">
                        <span>
                            Tổng thanh toán:
                        </span>
                        <span>
                            {{ formatMoney(getTotalAmount(order.orderDetails as ICart[])) }}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import calendarIcon from "@assets/svg/calendar.svg"
import { breakpointOrders } from "@utils/breackpoints"
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay, EffectCube } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cube";
import { SwiperModule } from "swiper/types";
import OrderItem from "@/components/cart/OrderItem.vue"
import { useListOrderUser } from "@/api/order/query";
import { formatTime } from "@utils/formatTime"
import { getTotalAmount } from "@/utils/product/getTotalPrice";
import { ICart } from "@/types/cart.types";
import { formatMoney } from "@/utils/formatMoney";

const modules: SwiperModule[] = [Navigation, Pagination, Autoplay, EffectCube];
interface IOrderStatus {
    id: number,
    title: string
}
const listOrderStatus = <IOrderStatus[]>([
    {
        id: 0,
        title: 'Tất cả'
    },
    {
        id: 1,
        title: 'Chờ xác nhận'
    },
    {
        id: 2,
        title: 'Đã xác nhận'
    },
    {
        id: 3,
        title: 'Đang giao hàng'
    },
    {
        id: 4,
        title: 'Đã giao hàng'
    },
    {
        id: 5,
        title: 'Đã hủy'
    },
])

const { data: orderUser, refetch, isLoading, isFetching } = useListOrderUser()
console.log(orderUser)
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
                transition: color .2s cubic-bezier(0.075, 0.82, 0.165, 1);

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

                            .order-payment--status {
                                color: $green;
                                background-color: rgba(0, 255, 136, 0.159);
                                border-radius: 10px;
                                padding: 6px 12px;
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
                        .order-btn--cancel {
                            color: $red;
                            padding: 8px 12px;
                            font-weight: 500;
                            border-radius: 4px;
                            transition: all .2s cubic-bezier(0.075, 0.82, 0.165, 1);

                            &:hover {
                                opacity: 0.75;
                            }
                        }
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