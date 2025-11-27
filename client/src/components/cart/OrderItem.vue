<template>
    <div class="order-item-cps tw-flex tw-justify-between tw-gap-3 tw-px-4">
        <div class="list-product__left tw-flex tw-gap-4 ">
            <div class="product-img">
                <img class="tw-w-full tw-h-full tw-object-cover"
                    :src="item.image || 'https://via.placeholder.com/65'" alt="" />
            </div>
            <div class="product-desc tw-py-2 tw-flex tw-flex-col tw-justify-between">
                <router-link :to="`/product/${item.product}`"
                    class="product-desc--name tw-cursor-pointer hover:tw-text-red tw-transition-all">
                    {{ item.name }}
                </router-link>
                <div class="product-desc__price tw-flex tw-gap-2">
                    <div class="product-desc__price--show">
                        {{ formatMoney(item.price) }}
                    </div>
                </div>
                <div class="product-desc--option" v-if="item.variant">
                    <span v-if="item.variant.color">{{ item.variant.color }}</span>
                    <span v-if="item.variant.memory"> - {{ item.variant.memory }}</span>
                </div>
            </div>
        </div>
        <div class="list-product__right tw-flex tw-flex-col tw-justify-between tw-items-end">
            <div class="product-quantity tw-flex tw-gap-1">
                <span class="product-quantity__title">
                    Số lượng:
                </span>
                <span class="product-quantity__number">
                    {{ item.qty }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { IOrderItem } from '@/types/order.type';
import { formatMoney } from '@/utils/formatMoney';

const { item } = defineProps<{ item: IOrderItem }>();

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