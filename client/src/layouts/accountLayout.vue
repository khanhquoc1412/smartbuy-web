<template>
  <div class="default-layout">
    <Header />
    <div class="app-main tw-flex tw-flex-col tw-gap-5 tw-pb-4">
      <BreadScrumb name-page="Tài khoản" :sub-navs="[]" />
      <Container>
        <div class="app-account">
          <div class="app-account__left">
            <div class="sidebar">
              <div class="account-info tw-flex tw-items-center tw-gap-3">
                <div class="avatar" v-if="user.avatarUrl">
                  <img :src="user.avatarUrl" alt="" />
                </div>
                <div class="avatar" v-else>
                  <img
                    src="https://bim.gov.vn/Upload/images/staffs/avatar-default.jpg"
                    alt=""
                  />
                </div>
                <div class="base-info">
                  <span class="title">Hello</span>
                  <span class="name">{{ user.userName }}</span>
                </div>
              </div>

              <!-- Sidebar item -->
              <router-link
                v-for="item in sidebarItemsWithAdmin"
                :key="item.value"
                :to="item.path"
                class="sidebar-item tw-flex tw-gap-1"
              >
                <img class="tw-h-6 tw-w-6" :src="item.icon" :alt="item.value" />
                <span>{{ item.title }}</span>
              </router-link>

              <!-- Logout -->
              <div
                class="sidebar-item app-logout tw-flex tw-gap-1"
                @click="activeModal"
              >
                <div class="sidebar__left tw-h-6 tw-w-6">
                  <img
                    class="tw-h-full tw-w-full"
                    :src="logoutSvg"
                    alt="logout-icon"
                  />
                </div>
                <div class="sidebar__right">Đăng xuất</div>
              </div>
            </div>

            <!-- Modal -->
            <div id="sign-out-modal">
              <Modal
                content="Bạn muốn thoát tài khoản?"
                :is-active="activeModalSignOut"
                @updateIsActive="closeModal"
                @confirmAction="handleLogout"
              />
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
    <Footer />
  </div>
</template>
