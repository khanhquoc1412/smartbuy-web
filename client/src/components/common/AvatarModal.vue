<template>
    <div class="modal" v-if="isActive">
        <div class="modal-background" @click="closeModal"></div>
        <div class="modal-content">
            <div class="avatar-container">
                <img :src="avatarUrl || defaultAvatar" alt="User Avatar" class="avatar-large" />
            </div>
            <div class="actions">
                <button class="btn btn--cancel" @click="closeModal">Đóng</button>
                <button class="btn btn--submit" @click="triggerFileInput">Thay đổi ảnh</button>
                <input type="file" ref="fileInput" class="hidden-input" accept="image/*" @change="handleFileChange" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{
    isActive: boolean;
    avatarUrl?: string | null;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'upload', file: File): void;
}>();

const defaultAvatar = "https://bim.gov.vn/Upload/images/staffs/avatar-default.jpg";
const fileInput = ref<HTMLInputElement | null>(null);

const closeModal = () => {
    emit('close');
};

const triggerFileInput = () => {
    fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        emit('upload', target.files[0]);
        // Reset input so the same file can be selected again if needed
        target.value = '';
    }
};
</script>

<style lang="scss" scoped>
.modal {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    &-background {
        bottom: 0;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        background-color: hsla(0, 0%, 4%, .86);
    }

    &-content {
        padding: 20px;
        background-color: #fff;
        position: absolute;
        border-radius: 8px;
        color: #000;
        width: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }
}

.avatar-container {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #eee;

    .avatar-large {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.actions {
    display: flex;
    gap: 15px;
    width: 100%;
    justify-content: center;
}

.btn {
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: opacity 0.2s;

    &:hover {
        opacity: 0.8;
    }

    &--cancel {
        background-color: #f3f4f6;
        color: #374151;
    }

    &--submit {
        background-color: #ef4444; /* Tailwind red-500 */
        color: white;
    }
}

.hidden-input {
    display: none;
}
</style>
