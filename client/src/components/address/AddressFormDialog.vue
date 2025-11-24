<template>
  <!-- Overlay với z-index cao -->
  <div
    v-if="modelValue"
    class="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-[9999]"
    @click.self="handleClose"
  >
    <!-- Dialog Box -->
    <div
      class="tw-bg-white tw-rounded-lg tw-shadow-2xl tw-w-full tw-max-w-2xl tw-max-h-[90vh] tw-overflow-y-auto tw-m-4 tw-relative tw-z-[10000]"
      @click.stop
    >
      <!-- Header -->
      <div class="tw-flex tw-items-center tw-justify-between tw-p-6 tw-border-b tw-sticky tw-top-0 tw-bg-white tw-z-10">
        <h2 class="tw-text-2xl tw-font-bold tw-text-gray-900">
          {{ mode === 'add' ? 'Thêm địa chỉ mới' : 'Sửa địa chỉ' }}
        </h2>
        <button
          @click="handleClose"
          class="tw-text-gray-400 hover:tw-text-gray-600 tw-transition-colors"
          type="button"
        >
          <svg class="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="handleSubmit" class="tw-p-6">
        <!-- Nhãn địa chỉ -->
        <div class="tw-mb-4">
          <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
            Nhãn địa chỉ
          </label>
          <input
            v-model="formData.label"
            type="text"
            placeholder="Nhà riêng, Văn phòng..."
            class="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red focus:tw-border-transparent"
          />
        </div>

        <!-- Họ và tên & Số điện thoại -->
        <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-4">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
              Họ và tên <span class="tw-text-red">*</span>
            </label>
            <input
              v-model="formData.fullName"
              type="text"
              required
              class="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red focus:tw-border-transparent"
            />
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
              Số điện thoại <span class="tw-text-red">*</span>
            </label>
            <input
              v-model="formData.phone"
              type="tel"
              required
              pattern="[0-9]{10,11}"
              class="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red focus:tw-border-transparent"
            />
          </div>
        </div>

        <!-- Tỉnh/Thành phố, Quận/Huyện, Phường/Xã -->
        <div class="tw-grid tw-grid-cols-3 tw-gap-4 tw-mb-4">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
              Tỉnh/Thành phố <span class="tw-text-red">*</span>
            </label>
            <input
              v-model="formData.province"
              type="text"
              required
              class="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red focus:tw-border-transparent"
            />
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
              Quận/Huyện <span class="tw-text-red">*</span>
            </label>
            <input
              v-model="formData.district"
              type="text"
              required
              class="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red focus:tw-border-transparent"
            />
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
              Phường/Xã <span class="tw-text-red">*</span>
            </label>
            <input
              v-model="formData.ward"
              type="text"
              required
              class="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red focus:tw-border-transparent"
            />
          </div>
        </div>

        <!-- Địa chỉ cụ thể -->
        <div class="tw-mb-4">
          <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
            Địa chỉ cụ thể <span class="tw-text-red">*</span>
          </label>
          <textarea
            v-model="formData.address"
            required
            rows="3"
            placeholder="Số nhà, tên đường..."
            class="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red focus:tw-border-transparent tw-resize-none"
          ></textarea>
        </div>

        <!-- ✅ TOGGLE SWITCH ĐẶT LÀM MẶC ĐỊNH -->
        <div class="tw-mb-6">
          <div class="tw-flex tw-items-center tw-justify-between">
            <label class="tw-text-sm tw-font-medium tw-text-gray-700">
              Đặt làm địa chỉ mặc định
            </label>
            
            <!-- Toggle Switch -->
            <button
              type="button"
              @click="toggleDefault"
              class="tw-relative tw-inline-flex tw-h-6 tw-w-11 tw-items-center tw-rounded-full tw-transition-colors tw-duration-200"
              :class="
                formData.isDefault
                  ? 'tw-bg-red'
                  : 'tw-bg-gray-300'
              "
            >
              <!-- Toggle Circle -->
              <span
                class="tw-inline-block tw-h-4 tw-w-4 tw-transform tw-rounded-full tw-bg-white tw-transition-transform tw-duration-200 tw-shadow-md"
                :class="
                  formData.isDefault
                    ? 'tw-translate-x-6'
                    : 'tw-translate-x-1'
                "
              ></span>
            </button>
          </div>
          
          <!-- ✅ Hiển thị trạng thái hiện tại -->
          <p class="tw-text-xs tw-text-gray-500 tw-mt-2">
            {{ formData.isDefault ? '✅ Địa chỉ này sẽ được đặt làm mặc định' : '⚠️ Địa chỉ này sẽ KHÔNG phải là mặc định' }}
          </p>
        </div>

        <!-- Actions -->
        <div class="tw-flex tw-gap-3 tw-justify-end">
          <button
            type="button"
            @click="handleClose"
            class="tw-px-6 tw-py-2 tw-border tw-border-gray-300 tw-text-gray-700 tw-rounded-lg hover:tw-bg-gray-50 tw-transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="tw-px-6 tw-py-2 tw-bg-red tw-text-white tw-rounded-lg hover:tw-bg-red-700 tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
          >
            {{ loading ? 'Đang xử lý...' : (mode === 'add' ? 'Thêm địa chỉ' : 'Cập nhật') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { IAddress, IAddressPayload } from '@/types/address.type';

interface Props {
  modelValue: boolean;
  mode: 'add' | 'edit';
  address?: IAddress | null;
  loading?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', payload: IAddressPayload): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();

const formData = ref<IAddressPayload>({
  label: '',
  fullName: '',
  phone: '',
  province: '',
  district: '',
  ward: '',
  address: '',
  isDefault: false,
});

// ✅ Lưu trạng thái ban đầu
const originalIsDefault = ref(false);

// Reset form khi đóng/mở dialog
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    console.log('🔵 Dialog opened');
    console.log('  Mode:', props.mode);
    console.log('  Address:', props.address);

    if (props.mode === 'edit' && props.address) {
      console.log('  ✏️ EDIT MODE');
      console.log('  Original isDefault:', props.address.isDefault);
      
      // ✅ Lưu trạng thái ban đầu
      originalIsDefault.value = props.address.isDefault;
      
      formData.value = {
        label: props.address.label,
        fullName: props.address.fullName,
        phone: props.address.phone,
        province: props.address.province,
        district: props.address.district,
        ward: props.address.ward,
        address: props.address.address,
        isDefault: props.address.isDefault,  // ✅ Giữ nguyên trạng thái
      };
      
      console.log('  Form isDefault:', formData.value.isDefault);
    } else {
      console.log('  ➕ ADD MODE');
      originalIsDefault.value = false;
      
      formData.value = {
        label: '',
        fullName: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        address: '',
        isDefault: false,
      };
    }
  }
});

// ✅ Toggle function với logs
const toggleDefault = () => {
  formData.value.isDefault = !formData.value.isDefault;
  
  console.log('🔄 Toggle isDefault');
  console.log('  Original:', originalIsDefault.value);
  console.log('  Current:', formData.value.isDefault);
  console.log('  Changed:', originalIsDefault.value !== formData.value.isDefault);
};

const handleClose = () => {
  emit('update:modelValue', false);
};

const handleSubmit = () => {
  console.log('📝 Form submit');
  console.log('  Mode:', props.mode);
  console.log('  Original isDefault:', originalIsDefault.value);
  console.log('  New isDefault:', formData.value.isDefault);
  console.log('  Changed:', originalIsDefault.value !== formData.value.isDefault);
  console.log('  Form data:', formData.value);
  
  emit('submit', formData.value);
};
</script>