<template>
    <Listbox v-model="selectedItem" class="select-box tw-text-13px">
        <div class="tw-relative tw-mt-1">
            <ListboxButton v-if="selectedItem && props.type == 1"
                class="btn-select-box box-active hover:tw-opacity-80 tw-transition-all tw-relative tw-w-full tw-bg-gray-200 tw-cursor-default tw-rounded-lg tw-py-2 tw-pl-3 tw-pr-10 tw-text-left tw-focus:outline-none tw-focus-visible:border-indigo-500 tw-focus-visible:ring-2 tw-focus-visible:ring-white/75 tw-focus-visible:ring-offset-2 tw-focus-visible:ring-offset-orange-300 tw-sm:text-sm">
                <span class="tw-block tw-truncate ">{{ selectedItem.province_name }}</span>
                <span class="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2">
                    <svg viewBox="0 0 24 24" class="tw-w-3" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M8 10L12 14L16 10" stroke="#4b4b4b5d" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                        </g>
                    </svg>
                </span>
            </ListboxButton>
            <ListboxButton v-if="selectedItem && props.type == 2"
                class="btn-select-box box-active hover:tw-opacity-80 tw-transition-all tw-relative tw-w-full tw-bg-gray-200 tw-cursor-default tw-rounded-lg tw-py-2 tw-pl-3 tw-pr-10 tw-text-left tw-focus:outline-none tw-focus-visible:border-indigo-500 tw-focus-visible:ring-2 tw-focus-visible:ring-white/75 tw-focus-visible:ring-offset-2 tw-focus-visible:ring-offset-orange-300 tw-sm:text-sm">
                <span class="tw-block tw-truncate ">{{ selectedItem.district_name }}</span>
                <span class="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2">
                    <svg viewBox="0 0 24 24" class="tw-w-3" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M8 10L12 14L16 10" stroke="#4b4b4b5d" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                        </g>
                    </svg>
                </span>
            </ListboxButton>
            <ListboxButton v-if="selectedItem && props.type == 3"
                class="btn-select-box box-active hover:tw-opacity-80 tw-transition-all tw-relative tw-w-full tw-bg-gray-200 tw-cursor-default tw-rounded-lg tw-py-2 tw-pl-3 tw-pr-10 tw-text-left tw-focus:outline-none tw-focus-visible:border-indigo-500 tw-focus-visible:ring-2 tw-focus-visible:ring-white/75 tw-focus-visible:ring-offset-2 tw-focus-visible:ring-offset-orange-300 tw-sm:text-sm">
                <span class="tw-block tw-truncate ">{{ selectedItem.ward_name }}</span>
                <span class="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2">
                    <svg viewBox="0 0 24 24" class="tw-w-3" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M8 10L12 14L16 10" stroke="#4b4b4b5d" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                        </g>
                    </svg>
                </span>
            </ListboxButton>
            <ListboxButton v-if="!selectedItem"
                class="btn-select-box tw-relative hover:tw-opacity-80 tw-transition-all tw-w-full tw-bg-gray-200 tw-cursor-default tw-rounded-lg tw-py-2 tw-pl-3 tw-pr-10 tw-text-left tw-focus:outline-none tw-focus-visible:border-indigo-500 tw-focus-visible:ring-2 tw-focus-visible:ring-white/75 tw-focus-visible:ring-offset-2 tw-focus-visible:ring-offset-orange-300 tw-sm:text-sm">
                <span class="tw-block tw-truncate">{{ title }}</span>
                <span class="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-pr-2">
                    <svg viewBox="0 0 24 24" class="tw-w-3" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M8 10L12 14L16 10" stroke="#200E32" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                        </g>
                    </svg>
                </span>
            </ListboxButton>
            <transition leave-active-class="tw-transition tw-duration-100 tw-ease-in" leave-from-class="tw-opacity-100"
                leave-to-class="tw-opacity-0">
                <ListboxOptions
                    class="tw-absolute tw-z-50 tw-mt-1 tw-max-h-60 tw-w-full tw-overflow-auto tw-rounded-md tw-bg-white tw-py-1 tw-shadow-lg tw-ring-1 tw-ring-black/5 tw-focus:outline-none tw-sm:text-sm">
                    <ListboxOption v-slot="{ active, selected }" value="" as="template">
                        <li :class="[
                            active ? 'tw-bg-gray-100 tw-text-gray-900' : 'tw-text-gray-900',
                            'tw-cursor-default tw-py-2 tw-px-2',
                        ]">
                            <span :class="[
                                selected ? 'tw-font-bold' : 'tw-font-normal',
                                'tw-block tw-truncate',
                            ]">{{ title }}</span>
                        </li>
                    </ListboxOption>
                    <ListboxOption v-if="props.type == 1" v-slot="{ active, selected }" v-for="item in props.items"
                        :key="item.code" :value="item" as="template">
                        <li :class="[
                            active ? 'tw-bg-gray-100 tw-text-gray-900' : 'tw-text-gray-900',
                            'tw-cursor-default tw-py-2 tw-px-2',
                        ]">
                            <span :class="[
                                selected ? 'tw-font-bold' : 'tw-font-normal',
                                'tw-block tw-truncate',
                            ]">{{ item.province_name }}</span>
                        </li>
                    </ListboxOption>
                    <ListboxOption v-if="props.type == 2" v-slot="{ active, selected }" v-for="item in props.items"
                        :key="item.code" :value="item" as="template">
                        <li :class="[
                            active ? 'tw-bg-gray-100 tw-text-gray-900' : 'tw-text-gray-900',
                            'tw-cursor-default tw-py-2 tw-px-2',
                        ]">
                            <span :class="[
                                selected ? 'tw-font-bold' : 'tw-font-normal',
                                'tw-block tw-truncate',
                            ]">{{ item.district_name }}</span>
                        </li>
                    </ListboxOption>
                    <ListboxOption v-if="props.type == 3" v-slot="{ active, selected }" v-for="item in props.items"
                        :key="item.code" :value="item" as="template">
                        <li :class="[
                            active ? 'tw-bg-gray-100 tw-text-gray-900' : 'tw-text-gray-900',
                            'tw-cursor-default tw-py-2 tw-px-2',
                        ]">
                            <span :class="[
                                selected ? 'tw-font-bold' : 'tw-font-normal',
                                'tw-block tw-truncate',
                            ]">{{ item.ward_name }}</span>
                        </li>
                    </ListboxOption>

                </ListboxOptions>
            </transition>
        </div>
    </Listbox>
</template>

<script lang="ts" setup>
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'


// const props = defineProps(['modelValue', "items", "title"])
const emit = defineEmits(['update:modelValue'])
const props = defineProps<{ modelValue: any, items: any, title: string, type: number }>();

const selectedItem = computed({
    get() {
        return props.modelValue;
    },
    set(newValue) {
        emit("update:modelValue", newValue);
    },
});

</script>

<style lang="scss" scoped>
.select-box {
    font-size: 12px;

    .btn-select-box {
        border: 1px solid #e5e7eb;
        background-color: #f3f4f6;
        color: $black;

        &.box-active {
            border: 1px solid $black;
            color: $black;
            font-weight: 600;
        }
    }
}
</style>