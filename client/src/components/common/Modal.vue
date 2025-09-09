<template>
    <div class="modal" v-if="isActive">
        <div class="modal-background" @click="closeModal">

        </div>
        <div class="modal-content">
            <div class="content" v-if="content">
                <p>
                    {{ content }}
                </p>
                <div class="btn-group">
                    <button class="btn--cancel" @click="closeModal">
                        Không
                    </button>
                    <button class="btn--submit" @click="confirmAction">
                        Xác nhận
                    </button>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
const { content, isActive } = defineProps<{ content: string, isActive: boolean }>();
const emit = defineEmits();
const closeModal = () => {
    emit('updateIsActive', false);
};
const confirmAction = () => {
    emit('confirmAction');
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
        padding: 15px;
        background-color: $white;
        position: absolute;
        border-radius: 8px;
        color: $black;
        width: 600px;

        .content {
            display: flex;
            flex-direction: column;
            gap: 25px;
        }

        p {
            font-size: 16px;
            font-weight: 600;
            text-align: center;
        }

        .btn-group {
            display: flex;
            justify-content: space-between;
            gap: 20px;

            button {
                padding: 12px 0;
                width: calc(50% - 7.5px);
                border-radius: 8px;
                font-weight: 500;
                transition: opacity .2s ease-in-out;

                &:hover {
                    opacity: 0.75;
                }
            }

            .btn {
                &--cancel {
                    color: $black;
                    background-color: $bg-light-gray;

                }

                &--submit {
                    color: $white;
                    background-color: $red;
                }
            }
        }
    }
}
</style>