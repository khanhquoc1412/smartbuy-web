<template>
  <div class="app-checkout tw-flex tw-flex-col tw-gap-5 tw-pb-4">
    <BreadScrumb
      name-page="Thông tin thanh toán"
      :sub-navs="[{ name: 'Giỏ hàng', path: '/cart' }]"
    />

    <Container class="checkout-section tw-flex tw-gap-4 tw-flex-col">
      <div class="title">Thông tin đơn hàng </div>
      <div
        v-if="userId"
        class="list-product tw-flex tw-justify-between tw-gap-3"
        v-for="cartItem in filteredCartItems"
        :key="cartItem._id"
      >
        <div class="list-product__left tw-flex tw-gap-4">
          <div class="product-img">
            <img
              class="tw-w-full tw-h-full tw-object-cover"
              :src="cartItem.productVariant.product?.thumbUrl"
              alt=""
            />
          </div>
          <div
            class="product-desc tw-py-2 tw-flex tw-flex-col tw-justify-between"
          >
            <router-link
              :to="`/product/${cartItem.productVariant.product?.slug}`"
              class="product-desc--name tw-cursor-pointer hover:tw-text-red tw-transition-all"
            >
              {{ cartItem.productVariant.product?.name }}
              {{ cartItem.productVariant.memory?.ram }}
              /
              {{ cartItem.productVariant.memory?.rom }}
              -
              {{ cartItem.productVariant.color?.name }}
            </router-link>
            <div class="product-desc__price tw-flex tw-gap-2">
              <div class="product-desc__price--show">
                {{ formatMoney(cartItem.productVariant.price) }}
              </div>
              <div class="product-desc__price--throw">
                {{
                  formatMoney(getRealPrice(cartItem.productVariant.price,
                    cartItem.productVariant.product?.discountPercentage as number)) }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="list-product__right tw-flex tw-flex-col tw-justify-between tw-items-end"
        >
          <div class="product-quantity tw-flex tw-gap-1">
            <span class="product-quantity__title"> Số lượng: </span>
            <span class="product-quantity__number">
              {{ cartItem.quantity }}
            </span>
          </div>
        </div>
      </div>
      <div v-else class="list-product tw-flex tw-justify-between tw-gap-3">
        <div v-if="productGuest" class="list-product__left tw-flex tw-gap-4">
          <div class="product-img">
            <img
              class="tw-w-full tw-h-full tw-object-cover"
              :src="productGuest.product?.thumbUrl"
              alt=""
            />
          </div>
          <div
            class="product-desc tw-py-2 tw-flex tw-flex-col tw-justify-between"
          >
            <router-link
              :to="`/product/${productGuest.product?.slug}`"
              class="product-desc--name tw-cursor-pointer hover:tw-text-red tw-transition-all"
            >
              {{ productGuest.product?.name }}
              {{ productGuest.memory?.ram }}
              /
              {{ productGuest.memory?.rom }}
              -
              {{ productGuest.color?.name }}
            </router-link>
            <div class="product-desc__price tw-flex tw-gap-2">
              <div class="product-desc__price--show">
                {{ formatMoney(productGuest.price as number) }}
              </div>
              <div class="product-desc__price--throw">
                {{
                  formatMoney(getRealPrice(productGuest.price as number,
                    productGuest.product?.discountPercentage as number)) }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="list-product__right tw-flex tw-flex-col tw-justify-between tw-items-end"
        >
          <div class="product-quantity tw-flex tw-gap-1">
            <span class="product-quantity__title"> Số lượng: </span>
            <span class="product-quantity__number"> 1 </span>
          </div>
        </div>
      </div>
      <!-- Only show customer info form if NOT using saved address -->
      <div v-if="!isUsingDefaultAddress" class="box-customer tw-flex tw-flex-col tw-gap-2">
        <div class="box-customer__title tw-uppercase">Thông tin khách hàng</div>
        <div class="box-customer__wrapper tw-flex tw-gap-4 tw-flex-col">
          <div class="box-customer__input">
            <MyInput
              id="name"
              name="name"
              placeholder="Nhập họ tên"
              v-model="baseInfor.userName"
            />
          </div>
          <div class="box-customer__input">
            <MyInput
              id="phone"
              name="phone"
              placeholder="Số điện thoại"
              v-model="baseInfor.phoneNumber"
            />
          </div>
          <!-- Email removed: not required on checkout -->
        </div>
      </div>
      <!-- Only show address section if user has addresses OR is using default address -->
      <div v-if="!isUsingDefaultAddress" class="box-address tw-flex tw-flex-col tw-gap-2">
        <div class="box-address__title tw-uppercase">
          Thông tin nhận hàng
          <span
            v-if="isUsingDefaultAddress"
            class="tw-text-sm tw-text-green-600 tw-ml-2"
          >
          </span>
        </div>
        <div class="box-address__wrapper">
          <!-- Nếu có address đã lưu, hiển thị list dạng form-like -->
          <template v-if="addressesList.length > 0">
            <div
              v-for="addr in addressesList"
              :key="addr._id"
              class="saved-address-card tw-p-3 tw-border tw-rounded-sm tw-w-full tw-bg-white tw-flex tw-flex-col tw-gap-2"
              :class="{
                'tw-border-red-500': addr.isDefault,
                'tw-border-gray-200': !addr.isDefault,
              }"
            >
              <div class="tw-flex tw-justify-between tw-items-start">
                <div class="tw-flex tw-items-center tw-gap-2">
                  <span
                    v-if="addr.isDefault"
                    class="tw-bg-red-500 tw-text-white tw-px-2 tw-py-1 tw-rounded-sm tw-text-xs"
                    >Mặc định</span
                  >
                  <div class="tw-text-sm tw-font-medium">
                    {{ addr.label || "Văn phòng" }}
                  </div>
                </div>
                <div class="tw-flex tw-gap-2">
                  <button
                    @click.prevent="onEditAddress(addr)"
                    class="tw-text-sm tw-border tw-px-3 tw-py-1 tw-rounded-sm tw-flex tw-items-center tw-gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Sửa
                  </button>
                </div>
              </div>

              <div class="tw-text-sm">
                <div><strong>Người nhận:</strong> {{ addr.fullName }}</div>
                <div><strong>Số điện thoại:</strong> {{ addr.phone }}</div>
                <div>
                  <strong>Địa chỉ:</strong> {{ formatSavedAddress(addr) }}
                </div>
              </div>

              <div class="tw-flex tw-justify-end">
                <button
                  @click.prevent="selectAddress(addr)"
                  class="tw-bg-green-500 tw-text-white tw-px-3 tw-py-1 tw-rounded-sm tw-text-sm"
                >
                  Chọn địa chỉ này
                </button>
              </div>
            </div>
          </template>

          <!-- Nếu chưa có address nào -->
          <template v-if="addressesList.length === 0 && !isUsingDefaultAddress">
            <div
              class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-3 tw-py-6"
            >
              <div class="tw-text-sm tw-text-gray-600">
                Bạn chưa có địa chỉ giao hàng nào.
              </div>
              <button
                @click.prevent="goToAccountForAddress"
                class="tw-bg-red-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-sm"
              >
                Thêm địa chỉ giao hàng
              </button>
            </div>
          </template>
        </div>
      </div>
      <!-- Nếu đã có địa chỉ mặc định, hiển thị thẻ thông tin người nhận (read-only) -->
      <div v-if="isUsingDefaultAddress" class="tw-mt-3">
        <div class="tw-uppercase tw-font-bold tw-mb-2">Địa chỉ nhận hàng</div>
        <div
          class="recipient-display tw-border tw-rounded-sm tw-p-3 tw-bg-white"
        >
          <div class="tw-flex tw-justify-between tw-items-start">
            <div>
              <div class="tw-font-semibold">
                Người nhận: {{ baseInfor.userName }}
              </div>
              <div class="tw-text-sm tw-text-gray-600">
                Số điện thoại: {{ baseInfor.phoneNumber }}
              </div>
            </div>
            <div>
              <button
                @click.prevent="goToAccountForAddress"
                class="tw-text-sm tw-border tw-px-3 tw-py-1 tw-rounded-sm tw-flex tw-items-center tw-gap-1 tw-inline-flex"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="tw-w-4 tw-h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Sửa
              </button>
            </div>
          </div>
          <div class="tw-mt-2 tw-text-sm">
            Địa chỉ:
            {{
              formatSavedAddress({
                address: address.address,
                ward: address.ward,
                district: address.district,
                province: address.province,
              })
            }}
          </div>
        </div>
      </div>
      <div class="box-payment tw-flex tw-flex-col tw-gap-2">
        <div class="box-payment__title tw-uppercase">Thanh toán</div>
        <div class="box-payment__wrapper">
          <div class="box-input coupon tw-flex tw-gap-5">
            <MyInput id="name" placeholder="Mã giảm giá" class="tw-flex-1" />
            <button class="hover:tw-opacity-75 tw-transition-all">
              Áp dụng
            </button>
          </div>
        </div>
        <div
          class="payment-option tw-bg-white tw-p-2 tw-mt-2 tw-rounded-sm tw-flex tw-gap-2 tw-flex-col"
        >
          <div class="tw-flex tw-items-center tw-gap-2">
            <input
              id="tw-default-radio-1"
              type="radio"
              v-model="paymentSelected"
              :value="2"
              name="tw-default-radio"
              class="tw-w-4 tw-h-4 tw-text-blue-600 tw-bg-gray-100 tw-border-gray-300 tw-focus:tw-ring-blue-500 dark:tw-focus:tw-ring-blue-600 dark:tw-ring-offset-gray-800 tw-focus:tw-ring-2 dark:tw-bg-gray-700 dark:tw-border-gray-600"
            />
            <img class="tw-h-10 tw-w-10" :src="vnpayLogo" alt="" />
            <label
              for="tw-default-radio-1"
              class="tw-ms-2 tw-text-sm tw-font-medium tw-text-gray-900"
              >VNPAY</label
            >
          </div>
          <div class="tw-flex tw-items-center tw-gap-2">
            <input
              checked
              id="tw-default-radio-2"
              type="radio"
              v-model="paymentSelected"
              :value="1"
              name="tw-default-radio"
              class="tw-w-4 tw-h-4 tw-text-blue-600 tw-bg-gray-100 tw-border-gray-300 tw-focus:tw-ring-blue-500 dark:tw-focus:tw-ring-blue-600 dark:tw-ring-offset-gray-800 tw-focus:tw-ring-2 dark:tw-bg-gray-700 dark:tw-border-gray-600"
            />
            <img class="tw-h-10 tw-w-10" :src="shippingLogo" alt="" />
            <label
              for="tw-default-radio-2"
              class="tw-ms-2 tw-text-sm tw-font-medium tw-text-gray-900"
            >
              Thanh toán khi nhận hàng
            </label>
          </div>
        </div>
      </div>
      <div id="stickyBottomBar" class="tw-fixed">
        <div
          v-if="cartItems.length > 0"
          class="price-info tw-flex tw-justify-between"
        >
          <div class="price-term tw-flex tw-flex-col tw-gap-2">
            <p class="tw-block">Tổng tiền sản phẩm:</p>
            <span class="tw-block">
              {{ formatMoney(selectedTotal) }}
            </span>
          </div>
          <button
            @click="handleOrder"
            class="btn-checkout tw-self-start tw-justify-self-start hover:tw-opacity-75 tw-transition-all tw-cursor-pointer"
          >
            <span> Đặt hàng </span>
          </button>
        </div>
        <div v-if="productGuest" class="price-info tw-flex tw-justify-between">
          <div class="price-term tw-flex tw-flex-col tw-gap-2">
            <p class="tw-block">Tổng tiền sản phẩm:</p>
            <span class="tw-block">
              {{ formatMoney(productGuest.price as number) }}
            </span>
          </div>
          <button
            @click="handleOrderGuest"
            class="btn-checkout tw-self-start tw-justify-self-start hover:tw-opacity-75 tw-transition-all tw-cursor-pointer"
          >
            <span> Đặt hàng </span>
          </button>
        </div>
      </div>
    </Container>
  </div>
</template>

<script lang="ts" setup>
import Container from "@/components/base/Container.vue";
import BreadScrumb from "@/components/base/BreadScrumb.vue";
import MyInput from "@components/common/MyInput/index.vue";
import SelectAddress from "@/components/common/SelectAddress.vue";
import { _axios } from "@plugins/axios/axios";
import vnpayLogo from "@/assets/svg/payments/vnpay-seeklogo.svg";
import shippingLogo from "@/assets/svg/payments/shipping_logo.svg";
import {
  IAddressForm,
  IAddress,
  IDistrict,
  IProvince,
  IWard,
} from "@/types/address.type";
import { IOrderInfor, IOrderInforGuest } from "@/types/order.type";
import { useCart } from "@/composables/useCart";
import { useGetProductVariant } from "@/api/product/query";
import { useOrder } from "@/composables/useOrder";
import { usePayment } from "@/composables/usePayment";
import { useAuth } from "@/composables/useAuth";
import { useDefaultAddressQuery, useAddressesQuery } from "@/api/address/query";
import { formatMoney } from "@/utils/formatMoney";
import { getRealPrice } from "@/utils/product/getPriceAfterDiscount";
import { getTotalAmount } from "@/utils/product/getTotalPrice";
import { IProductVariant } from "@/types/product.types";
import { PRODUCT_GUEST } from "@/utils/constants";

import { ref, watch, computed, onMounted } from "vue";

import { useRouter } from "vue-router";

const router = useRouter();

// query lấy default và list addresses
const { data: defaultAddress, isLoading: loadingDefault } =
  useDefaultAddressQuery();
const { data: addressesData, isLoading: loadingList } = useAddressesQuery();

// computed list addresses
const addressesList = computed(() => {
  return addressesData?.value && Array.isArray(addressesData.value.addresses)
    ? addressesData.value.addresses
    : [];
});

// form state (ví dụ)
const form = {
  fullName: "",
  phone: "",
  province: "",
  district: "",
  ward: "",
  address: "",
};

watch([defaultAddress, addressesData], ([def, list]) => {
  console.log(
    "DEBUG defaultAddress raw:",
    defaultAddress?.value ?? defaultAddress
  );
  console.log(
    "DEBUG addressesData raw:",
    addressesData?.value ?? addressesData
  );
  if (loadingDefault || loadingList) return;

  // nếu có defaultAddress thì điền form
  const addrObj = def ?? def?.value ?? null;
  if (addrObj) {
    const addr = addrObj?.data?.address ?? addrObj?.address ?? addrObj;
    if (addr) {
      // populate the form inputs used by template
      baseInfor.value.userName = addr.fullName || "";
      baseInfor.value.phoneNumber = addr.phone || "";
      address.value.province = addr.province || "";
      address.value.district = addr.district || "";
      address.value.ward = addr.ward || "";
      address.value.address = addr.address || "";
      isUsingDefaultAddress.value = true;
    }
  }
});

const host = "https://vapi.vnappmob.com/api/";
// define inteface
interface IBaseInfor {
  userName: string;
  phoneNumber: string;
}

//get info carts
const { userId } = useAuth();
const {
  orderProduct,
  orderData,
  orderError,
  isOrderLoading,
  orderProductGuest,
  orderGuestData,
  orderGuestError,
  isOrderGuestLoading,
} = useOrder();

const {
  createVNPayPayment,
  createCODPayment,
  isLoading: isPaymentLoading,
} = usePayment();

const { getUserCarts, cartItems } = useCart();

// ✅ NEW: Get selected cart items from sessionStorage
const selectedCartItemIds = ref<string[]>([]);

// ✅ NEW: Computed property to filter only selected items for display
const filteredCartItems = computed(() => {
  if (selectedCartItemIds.value.length === 0) {
    // If no selection, show all (backward compatibility)
    return cartItems.value;
  }
  // Filter to only show selected items
  return cartItems.value.filter(item => 
    selectedCartItemIds.value.includes(item._id)
  );
});

// ✅ NEW: Computed total for selected items only
const selectedTotal = computed(() => {
  return getTotalAmount(filteredCartItems.value);
});

// Lấy địa chỉ mặc định

// Debug log

//get info provinces
const provinces = ref<IProvince[]>([]);
const districts = ref<IDistrict[]>([]);
const wards = ref<IWard[]>([]);

// Address có thể là object (từ dropdown) hoặc string (từ địa chỉ đã lưu)
const address = ref({
  province: null as IProvince | string | null,
  district: null as IDistrict | string | null,
  ward: null as IWard | string | null,
  address: undefined as string | undefined,
});

// Flag để biết đang dùng địa chỉ đã lưu hay nhập mới
const isUsingDefaultAddress = ref(false);
const { data: productGuest, isFetching } = useGetProductVariant(
  localStorage.getItem(PRODUCT_GUEST) as string
);

onMounted(async () => {
  if (userId.value) {
    await getUserCarts(userId.value);
  }
  
  // ✅ NEW: Load selected cart items from sessionStorage
  const selectedItemsStr = sessionStorage.getItem('selectedCartItems');
  if (selectedItemsStr) {
    try {
      selectedCartItemIds.value = JSON.parse(selectedItemsStr) as string[];
      console.log('🔍 Loaded selected items from sessionStorage:', selectedCartItemIds.value);
    } catch (error) {
      console.error('Error parsing selectedCartItems:', error);
      selectedCartItemIds.value = [];
    }
  }
});

// Watch địa chỉ mặc định và tự động điền vào form
watch(
  defaultAddress,
  (newAddress) => {
    if (newAddress && userId.value) {
      console.log("✅ Tìm thấy địa chỉ mặc định:", newAddress);

      // Tự động điền thông tin khách hàng
      baseInfor.value.userName = newAddress.fullName || "";
      baseInfor.value.phoneNumber = newAddress.phone || "";

      // Tự động điền địa chỉ dạng string (không dùng dropdown)
      address.value.province = newAddress.province || "";
      address.value.district = newAddress.district || "";
      address.value.ward = newAddress.ward || "";
      address.value.address = newAddress.address || "";

      isUsingDefaultAddress.value = true;

      console.log("✅ Đã tự động điền thông tin từ địa chỉ mặc định");
    }
  },
  { immediate: true }
);

const baseInfor = ref<IBaseInfor>({
  userName: "",
  phoneNumber: "",
});

const paymentSelected = ref<number>(1);

// Helper function để lấy giá trị string từ address
const getAddressString = (
  value: any,
  field: "province" | "district" | "ward"
): string => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    if (field === "province") return value.province_name || "";
    if (field === "district") return value.district_name || "";
    if (field === "ward") return value.ward_name || "";
  }
  return "";
};

// helper: format saved address into one line
const formatSavedAddress = (addr: any) => {
  if (!addr) return "";
  const parts = [] as string[];
  if (addr.address) parts.push(addr.address);
  if (addr.ward) parts.push(addr.ward);
  if (addr.district) parts.push(addr.district);
  if (addr.province) parts.push(addr.province);
  return parts.filter(Boolean).join(", ");
};

const selectedAddressId = ref<string | null>(null);

const selectAddress = (addr: any) => {
  if (!addr) return;
  selectedAddressId.value = addr._id || null;
  // Fill the values used by template
  baseInfor.value.userName = addr.fullName || "";
  baseInfor.value.phoneNumber = addr.phone || "";
  address.value.province = addr.province || "";
  address.value.district = addr.district || "";
  address.value.ward = addr.ward || "";
  address.value.address = addr.address || "";
  isUsingDefaultAddress.value = true;
};

const onEditAddress = (addr: any) => {
  // navigate to account page; can include query param to focus on edit
  if (addr && addr._id) {
    router.push({ path: "/account", query: { editAddressId: addr._id } });
  } else {
    router.push("/account");
  }
};

const goToAccountForAddress = () => {
  router.push("/account");
};

// ...existing code...
const handleOrder = async () => {
  if (
    Object.values(address.value).includes(null) ||
    !baseInfor.value.userName ||
    !baseInfor.value.phoneNumber ||
    cartItems.value.length === 0
  ) {
    alert("Vui lòng điền đầy đủ thông tin");
    return;
  }

  try {
    // ✅ NEW: Get selected cart item IDs from sessionStorage
    const selectedItemsStr = sessionStorage.getItem('selectedCartItems');
    const selectedCartItemIds = selectedItemsStr ? JSON.parse(selectedItemsStr) as string[] : [];
    
    // If no items are selected, use all cart items
    const cartItemIds = selectedCartItemIds.length > 0 
      ? selectedCartItemIds 
      : cartItems.value.map((ci: any) => ci._id);
    
    console.log('🔍 Selected cart item IDs:', cartItemIds);

    // Build orderItems to match OrderSchema
    const orderItems = cartItems.value
      .filter((ci: any) => cartItemIds.includes(ci._id)) // ✅ Only include selected items
      .map((ci: any) => ({
        product: (ci.productVariant.product?._id ||
          ci.productVariant._id) as string,
        name: ci.productVariant.product?.name || "",
        qty: ci.quantity,
        price: ci.productVariant.price,
        image: ci.productVariant.product?.thumbUrl || "",
        variant: {
          color: ci.productVariant.color?.name || "",
          memory:
            ci.productVariant.memory?.ram && ci.productVariant.memory?.rom
              ? `${ci.productVariant.memory.ram}/${ci.productVariant.memory.rom}`
              : "",
          variantId: ci.productVariant._id,
        },
      }));

    const itemsPrice = orderItems.reduce(
      (s: number, it: any) => s + Number(it.price || 0) * Number(it.qty || 1),
      0
    );
    const shippingPrice = 0;
    const totalPrice = itemsPrice + shippingPrice;

    const shippingAddressPayload = {
      fullName: baseInfor.value.userName,
      phone: baseInfor.value.phoneNumber,
      province: getAddressString(address.value.province, "province"),
      district: getAddressString(address.value.district, "district"),
      ward: getAddressString(address.value.ward, "ward"),
      address: address.value.address || "",
      addressId: selectedAddressId.value || undefined,
    };

    const paymentMethodStr = (
      paymentSelected.value === 2 ? "VNPAY" : "COD"
    ) as IOrderInfor["paymentMethod"];

    const orderPayload = {
      user: userId.value || null,
      orderItems,
      shippingAddress: shippingAddressPayload,
      paymentMethod: paymentMethodStr,
      itemsPrice,
      shippingPrice,
      taxPrice: 0,
      discountAmount: 0,
      totalPrice,
      notes: "", // optional
      cartItemIds, // ✅ NEW: Send cart item IDs to be removed after order creation
    };

    console.log("📤 [CLIENT DEBUG] createOrder payload:", orderPayload);

    const orderResponse: any = await orderProduct(orderPayload);
    console.log("✅ Raw response:", orderResponse);

    // ✅ NEW: Clear sessionStorage after successful order
    sessionStorage.removeItem('selectedCartItems');

    // Response structure: { success, message, data: { order, needPayment } }
    const orderData = orderResponse?.data || orderResponse;
    const createdOrder = orderData?.order || orderData;
    
    if (!createdOrder || (!createdOrder._id && !createdOrder.id)) {
      throw new Error("Không thể tạo đơn hàng - response không hợp lệ");
    }
    
    console.log("✅ Created order:", createdOrder);

    // payment & redirect
    if (paymentSelected.value === 2) {
      // VNPAY
      if (createdOrder.paymentUrl) {
        console.log("✅ Redirecting to VNPAY:", createdOrder.paymentUrl);
        window.location.href = createdOrder.paymentUrl;
      } else {
         // Fallback if no paymentUrl returned (should not happen for VNPAY)
         console.warn("⚠️ No paymentUrl returned for VNPAY order");
         // Try to create payment manually as fallback (or just error out)
          await createVNPayPayment(
            createdOrder._id || createdOrder.id,
            userId.value,
            getTotalAmount(cartItems.value),
            { name: baseInfor.value.userName, phone: baseInfor.value.phoneNumber }
          );
      }
    } else {
      // COD
      // If backend already handled COD payment creation (which it does), we just redirect
      // But if we need to ensure, we can keep the call or rely on backend.
      // Backend createOrderFromCart returns { order, needPayment: false } for COD.
      // So we just redirect to thank you page.
      
      router.push(
        `/cart/checkout/thank-you?orderId=${
          createdOrder._id || createdOrder.id
        }&orderNumber=${createdOrder.orderNumber || ''}`
      );
    }
  } catch (error: any) {
    console.error("❌ Lỗi đặt hàng:", error);
    alert(
      error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi đặt hàng"
    );
  }
};

// handle guest
const handleOrderGuest = async () => {
  if (
    Object.values(address.value).includes(null) ||
    !baseInfor.value.userName ||
    !baseInfor.value.phoneNumber
  ) {
    alert("Vui lòng điền đầy đủ thông tin");
    return;
  }

  try {
    const pvId = localStorage.getItem(PRODUCT_GUEST) as string;
    const pv = productGuest.value; // productVariant payload from API
    if (!pv) throw new Error("Không có thông tin sản phẩm guest");

    const orderItems = [
      {
        product: (pv.product?._id || pv._id) as string,
        name: pv.product?.name || "",
        qty: 1,
        price: pv.price || 0,
        image: pv.product?.thumbUrl || "",
        variant: {
          color: pv.color?.name || "",
          memory:
            pv.memory?.ram && pv.memory?.rom
              ? `${pv.memory.ram}/${pv.memory.rom}`
              : "",
          variantId: pv._id || pvId,
        },
      },
    ];

    const itemsPrice = orderItems.reduce(
      (s: number, it: any) => s + Number(it.price || 0) * Number(it.qty || 1),
      0
    );
    const shippingPrice = 0;
    const totalPrice = itemsPrice + shippingPrice;

    const shippingAddressPayload = {
      fullName: baseInfor.value.userName,
      phone: baseInfor.value.phoneNumber,
      province: getAddressString(address.value.province, "province"),
      district: getAddressString(address.value.district, "district"),
      ward: getAddressString(address.value.ward, "ward"),
      address: address.value.address || "",
      addressId: selectedAddressId.value || undefined,
    };

    const paymentMethodStr = (
      paymentSelected.value === 2 ? "VNPAY" : "COD"
    ) as IOrderInfor["paymentMethod"];

    const orderPayload = {
      user: null, // guest
      orderItems,
      shippingAddress: shippingAddressPayload,
      paymentMethod: paymentMethodStr,
      itemsPrice,
      shippingPrice,
      taxPrice: 0,
      discountAmount: 0,
      totalPrice,
      notes: "",
    };

    console.log("📤 [CLIENT DEBUG] createOrderGuest payload:", orderPayload);

    const orderResponse: any = await orderProductGuest(orderPayload);
    console.log("✅ Raw guest response:", orderResponse);

    // Response structure: { success, message, data: { order, needPayment } }
    const orderData = orderResponse?.data || orderResponse;
    const createdOrder = orderData?.order || orderData;
    
    if (!createdOrder || (!createdOrder._id && !createdOrder.id)) {
      throw new Error("Không thể tạo đơn hàng - response không hợp lệ");
    }
    
    console.log("✅ Created order (guest):", createdOrder);

    if (paymentSelected.value === 2) {
      // VNPAY
       if (createdOrder.paymentUrl) {
        console.log("✅ Redirecting to VNPAY (Guest):", createdOrder.paymentUrl);
        window.location.href = createdOrder.paymentUrl;
      } else {
         // Fallback
         await createVNPayPayment(
            createdOrder._id || createdOrder.id,
            "guest",
            totalPrice,
            { name: baseInfor.value.userName, phone: baseInfor.value.phoneNumber }
          );
      }
    } else {
      // COD
      router.push(
        `/cart/checkout/thank-you?orderId=${
          createdOrder._id || createdOrder.id
        }`
      );
    }
  } catch (error: any) {
    console.error("❌ Lỗi đặt hàng Guest:", error);
    alert(
      error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi đặt hàng"
    );
  }
};
// ...existing code...
</script>

<route lang="yaml">
name: Checkout
meta:
  layout: "cartLayout"
</route>
<style lang="scss">
.app-checkout {
  min-height: calc(100vh - 80px);
  padding-bottom: 80px;

  .checkout-section {
    padding-bottom: 40px;
    max-width: 600px;

    //test

    .title {
      font-size: 20px;
      font-weight: 600;
      padding: 10px;
      border-bottom: 1px solid $border-section;
    }

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
            font-weight: 400;
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
            font-size: 14px;
          }

          &__number {
            color: red;
            font-size: 15px;
            font-weight: 500;
          }
        }
      }
    }

    .box-customer {
      &__title {
        font-size: 14px;
        font-weight: 400;
      }

      &__wrapper {
        padding: 15px;
        background-color: $white;
        border: 1px solid $border-section;
        border-radius: 4px;
      }
    }

    .box-address {
      &__title {
        font-size: 14px;
        font-weight: 400;
      }

      &__wrapper {
        padding: 10px;
        background-color: $white;
        border: 1px solid $border-section;
        border-radius: 4px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;

        .box-address__select {
          button {
            height: 43px;
          }
        }
        .box-address__wrapper {
          padding: 10px;
          background-color: $white;
          border: 1px solid $border-section;
          border-radius: 4px;
          display: flex; // Sửa từ grid sang flex
          flex-wrap: wrap;
          gap: 10px;
        }
        .box-address__input {
          flex: 1 1 45%; // Mỗi ô chiếm 45% chiều rộng, tự xuống dòng nếu thiếu chỗ
          min-width: 180px;
        }
      }
    }

    .box-payment {
      &__title {
        font-size: 14px;
        font-weight: 600;
        color: $red;
      }

      &__wrapper {
        .box-input {
          button {
            padding: 8px 12px;
            border-radius: 5px;
            color: $white;
            background-color: $red;
            font-weight: 500;
          }
        }
      }
    }

    #stickyBottomBar {
      padding: 10px;
      padding-bottom: 15px;
      background-color: #fff;
      border: 1px solid $border-section;
      max-width: 600px;
      width: 100%;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      z-index: 99;
      box-shadow: 0 -4px 20px -1px rgba(40, 124, 234, 0.15);
      left: 50%;
      transform: translateX(-50%);
      bottom: 0;

      .go-back {
        display: block;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        color: $white;
        // max-width: 600px;
        padding: 10px;
        background-color: $red;
        width: 100%;
        border-radius: 5px;
      }

      .price-info {
        .price-term {
          p {
            font-size: 14px;
            font-weight: 500;
            color: $black;
          }

          span {
            font-size: 16px;
            font-weight: 500;
            color: $red;
          }
        }

        .btn-checkout {
          padding: 10px;
          background-color: $red;
          color: $white;
          border-radius: 5px;
        }
      }
    }

    //test

    .checkout-main {
      gap: 20px;

      .info-shipment {
        .title {
          font-size: 16px;
          font-weight: 600;
        }

        .box-info {
          display: flex;
          flex-direction: column;
          gap: 16px;

          & > div {
            display: flex;
            flex-direction: column;
            gap: 10px;

            label {
              font-weight: 500;
              font-size: 13px;
            }
          }
        }

        .coupon {
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1.5px solid $border-section;

          .coupon-title {
            font-weight: 500;
          }

          .box-input {
            button {
              padding: 8px 12px;
              border-radius: 5px;
              color: $white;
              background-color: $red;
              font-weight: 500;
            }
          }
        }
      }

      .info-payment {
        background-color: $white;
        padding: 10px;
        border-radius: 5px;

        table {
          thead {
            font-size: 13px;
          }

          tbody {
            font-size: 13px;
          }
        }

        .total-price,
        .discount-price,
        .shipment-price,
        .total-payment {
          display: flex;
          justify-content: space-between;
        }

        .total-price,
        .discount-price,
        .shipment-price {
          font-size: 13px;
          font-weight: 500;
          padding: 4px 15px;
        }

        .total-payment {
          font-size: 15px;
          font-weight: 500;
          line-height: 125%;
          border-top: 1px solid $border-section;
          padding: 10px 15px;

          span:last-child {
            font-weight: 600;
            color: $red;
          }
        }

        .payment-option {
          padding: 10px 15px;

          .title {
            font-size: 14px;
            font-weight: 500;
          }
        }

        .btn-order {
          button {
            padding: 10px 15px;
            color: $white;
            background-color: $azure;
            border-radius: 5px;
            transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
            font-weight: 500;

            &:hover {
              opacity: 0.75;
            }
          }
        }
      }
    }
  }
}
</style>
