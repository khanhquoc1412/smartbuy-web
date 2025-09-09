<template>
    <div class="default-layout">
        <Header></Header>
        <div class="app-main tw-flex tw-flex-col tw-gap-5 tw-pb-4">
            <BreadScrumb name-page="Tài khoản" :sub-navs="[]" />
            <Container>
                <div class="app-account">
                    <div class="app-account__left">
                        <div class="sidebar">
                            <div class="account-info tw-flex tw-items-center tw-gap-3">
                                <div class="avatar" v-if="user.avatarUrl">
                                    <img :src="user.avatarUrl" alt="">
                                </div>
                                <div class="avatar" v-else>
                                    <img src="https://bim.gov.vn/Upload/images/staffs/avatar-default.jpg" alt="">
                                </div>
                                <div class="base-info">
                                    <span class="title">
                                        Hello
                                    </span>
                                    <span class="name">
                                        {{ user.userName }}
                                    </span>
                                </div>
                            </div>
                            <router-link class="sidebar-item tw-flex tw-gap-1" :to="item.path" v-for="item in sidebarItems"
                                :key="item.value">
                                <img class="tw-h-6 tw-w-6" :src="item.icon" :alt="item.value">
                                <span>{{ item.title }}</span>
                            </router-link>
                            <div class="sidebar-item app-logout  tw-flex tw-gap-1" @click="activeModal">
                                <div class="sidebar__left tw-h-6 tw-w-6">
                                    <img class="tw-h-full tw-w-full" :src="logoutSvg" alt="logout-icon">
                                </div>
                                <div class="sidebar__right">
                                    Đăng xuất
                                </div>
                            </div>
                        </div>
                        <div id="sign-out-modal">
                            <Modal content="Bạn muốn thoát tài khoản?" :is-active="activeModalSignOut"
                                @updateIsActive="closeModal" @confirmAction="handleLogout" />
                        </div>
                    </div>
                    <div class="app-account__right">
                        <div class="main">
                            <router-view />
                        </div>
                    </div>
                </div>
            </Container>
        </div>
        <Footer></Footer>
    </div>
</template>
  
<script lang="ts" setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Container from "@components/base/Container.vue";
import Header from "@/components/base/Header.vue"
import Footer from "@/components/base/Footer.vue";
import bagSvg from "@assets/svg/account/bag.svg"
import clockSvg from "@assets/svg/account/clock.svg"
import heartSvg from "@assets/svg/account/heart.svg"
import logoutSvg from "@assets/svg/account/logout.svg"
import profileSvg from "@assets/svg/account/profile.svg"
import notificationSvg from "@assets/svg/account/notification.svg"
import BreadScrumb from "@/components/base/BreadScrumb.vue";
import secureSvg from "@assets/svg/categories/secure.svg"
import Modal from "@/components/common/Modal.vue";
import { useAuth } from "@/composables/useAuth";

interface ISideBarItem {
    value: string,
    icon: string,
    title: string,
    path: string
}
const sidebarItems = ref<ISideBarItem[]>([
    {
        value: "user-info",
        icon: profileSvg,
        title: "Thông tin cá nhân",
        path: "/account",
    },
    {
        value: "clock-icon",
        icon: clockSvg,
        title: "Lịch sử mua hàng",
        path: "/account/order",
    },
    {
        value: "heart-icon",
        icon: heartSvg,
        title: "Sản phẩm yêu thích",
        path: "/account/wish-list",
    },
    {
        value: "notification-icon",
        icon: notificationSvg,
        title: "Thông báo",
        path: "/account/notification",
    },
    {
        value: "secure-icon",
        icon: secureSvg,
        title: "Thay đổi mật khẩu",
        path: "/account/change-password",
    },
]);
const { user } = useAuth()
const router = useRouter();
const activeModalSignOut = ref<boolean>(false)
const activeModal = () => {
    activeModalSignOut.value = true
}
const closeModal = (value: boolean) => {
    activeModalSignOut.value = value
}
const handleLogout = () => {
    localStorage.clear()
    router.push({ path: '/login' })
}
</script>

<style lang="scss" scoped>
.default-layout {
    .app-main {
        padding-top: 80px;
        min-height: calc(100vh - 354.8px);
    }
}

.app-account {
    display: flex;
    padding: 20px 0;
    position: relative;

    .sidebar {
        width: 270px;
        min-height: calc(100vh - 200px);
        background-color: rgba(189, 189, 189, 0.099);
        padding: 15px;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        position: sticky;
        top: 100px;
        box-sizing: border-box;
        gap: 10px;
        padding-bottom: 60px;
        justify-content: flex-start;


        .sidebar-item {
            padding: 8px 15px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-weight: 500;
            font-size: 14px;
            border-radius: 4px;
            transition: all 0.22s ease-in-out;
            cursor: pointer;
            border: 0.5px solid transparent;



            &.is-active,
            &:hover {
                background-color: #fee;
                border: 0.5px solid $red;
                color: $red;

                img {
                    filter: invert(37%) sepia(93%) saturate(7471%) hue-rotate(355deg) brightness(76%) contrast(135%);
                }
            }

            &.app-logout {
                position: absolute;
                bottom: 20px;

                &:hover {
                    background-color: transparent;
                    border: 0.5px solid transparent;
                    color: $red;

                    img {
                        filter: invert(37%) sepia(93%) saturate(7471%) hue-rotate(355deg) brightness(76%) contrast(135%);
                    }
                }
            }

        }

        .account-info {
            padding-bottom: 10px;
            border-bottom: 1px solid $border-section;

            .avatar {
                height: 50px;
                width: 50px;
                border-radius: 50%;

                img {
                    overflow: hidden;
                    height: 100%;
                    width: 100%;
                    border-radius: 50%;
                }
            }

            .base-info {
                display: flex;
                flex-direction: column;

                .title {
                    font-size: 14px;
                    font-weight: 500;
                    color: $gray;
                }

                .name {
                    font-size: 14px;
                    font-weight: 500;
                    color: $red;
                }
            }
        }
    }

    .app-account__left {
        #sign-out-modal {}
    }

    .app-account__right {
        width: calc(100% - 270px);
        padding-top: 15px;
        padding-left: 28px;

        .main {
            width: 100%;
        }
    }
}
</style>