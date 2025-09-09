<template>
    <div class="order-item-cps tw-flex tw-justify-between tw-gap-3 tw-px-4">
        <div class="list-product__left tw-flex tw-gap-4 ">
            <div class="product-img">
                <img class="tw-w-full tw-h-full tw-object-cover"
                    src="https://cdn.tgdd.vn/Products/Images/42/303891/TimerThumb/iphone-15-plus-green-1.jpeg" alt="" />
            </div>
            <div class="product-desc tw-py-2 tw-flex tw-flex-col tw-justify-between">
                <router-link :to="`/product/iphone-15promax`"
                    class="product-desc--name tw-cursor-pointer hover:tw-text-red tw-transition-all">
                    {{ item.productVariant?.product?.name }}
                </router-link>
                <div class="product-desc__price tw-flex tw-gap-2">
                    <div class="product-desc__price--show">
                        {{ formatMoney(item.productVariant.price as number) }}
                    </div>
                    <div class="product-desc__price--throw">
                        {{
                            formatMoney(getRealPrice(item.productVariant.price as number,
                                item.productVariant.product?.discountPercentage as number)) }}
                    </div>
                </div>
            </div>
        </div>
        <div class="list-product__right tw-flex tw-flex-col tw-justify-between tw-items-end">
            <div class="product-quantity tw-flex tw-gap-1">
                <span class="product-quantity__title">
                    Số lượng:
                </span>
                <span class="product-quantity__number">
                    {{ item.quantity }}
                </span>
            </div>
        </div>
    </div>
</template>
 
  
<script lang="ts" setup>
import { IOrderDetail } from '@/types/order.type';
import { IProductVariant } from '@/types/product.types';
import { formatMoney } from '@/utils/formatMoney';
import { getRealPrice } from '@/utils/product/getPriceAfterDiscount';

const { item } = defineProps<{ item: IOrderDetail }>();

</script>
  
<style lang="scss" scoped>
.order-item-cps {
    .list-product {
        background-color: $white;
        border: 1px solid $border-prd;
        border-radius: 5px;
        padding: 10px 10px;

        &__left {
            .product-img {
                height: 65px;
                width: 65px;
            }

            .product-desc {
                &--name {
                    font-size: 14px;
                    font-weight: 500;
                }

                &--option {
                    font-size: 12px;
                    color: $gray;
                }

                &__price {
                    span {
                        display: block;
                        text-align: center;
                    }

                    &--show {
                        font-size: 14px;
                        font-weight: 500;
                        color: $red;
                    }

                    &--throw {
                        font-size: 13px;
                        font-weight: 400;
                        color: $gray;
                        text-decoration: line-through;
                    }
                }
            }
        }

        &__right {
            .product-quantity {
                &__title {
                    font-size: 13px;
                    font-style: italic;
                }

                &__number {
                    color: red;
                    font-size: 15px;
                    font-weight: 500;
                }
            }
        }
    }
}
</style>