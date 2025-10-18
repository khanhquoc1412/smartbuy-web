```md
# 💻 client – Giao diện người dùng SmartBuy

## Công nghệ
- Vue 3 + Vite + TailwindCSS
- Router, Pinia (store), Axios

## Cấu trúc
client/
└── src/
    ├── api/
    │   ├── address/
    │   │   └── address.ts
    │   ├── auth/
    │   │   ├── auth.ts
    │   │   └── query.ts
    │   ├── cart/
    │   │   ├── cart.ts
    │   │   └── query.ts
    │   ├── order/
    │   │   ├── order.ts
    │   │   └── query.ts
    │   ├── product/
    │   │   ├── product.ts
    │   │   └── query.ts
    │   └── index.ts
    ├── assets/
    │   ├── css/
    │   ├── fonts/
    │   ├── images/
    │   ├── scss/
    │   └── svg/
    ├── components/
    │   ├── base/
    │   │   ├── BreadScrum.vue
    │   │   ├── Container.vue
    │   │   ├── Footer.vue
    │   │   ├── Header.vue
    │   │   ├── Heading.vue
    │   │   ├── LoadingPage.vue
    │   │   ├── ProductSkeleton.vue
    │   │   └── VPagination.vue
    │   ├── brands/
    │   │   └── Brands.vue
    │   ├── cart/
    │   │   └── OrderItem.vue
    │   ├── categories/
    │   │   ├── Categories.vue
    │   │   └── Menu.vue
    │   ├── common/
    │   │   ├── MyInput/
    │   │   ├── LoadIcon.vue
    │   │   ├── Modal.vue
    │   │   ├── SelectAddress.vue
    │   │   └── SelectBox.vue
    │   ├── home/
    │   │   └── ArrivalItem.vue
    │   └── product/
    │       ├── ProductBox.vue
    │       ├── ProductItem.vue
    │       └── TopSale.vue
    ├── composables/
    │   ├── index.ts
    │   ├── useAuth.ts
    │   ├── useCart.ts
    │   ├── useDevice.ts
    │   ├── useLoading.ts
    │   ├── useOrder.ts
    │   └── useProductTest.ts
    ├── layouts/
    │   ├── accountLayout.vue
    │   ├── cartLayout.vue
    │   └── default.vue
    ├── middleware/
    │   ├── auth.ts
    │   └── index.ts
    ├── module/
    │   └── auth/
    │       └── index.ts
    ├── pages/
    │   ├── account/
    │   │   ├── change-password/
    │   │   │   └── index.vue
    │   │   ├── notification/
    │   │   │   └── index.vue
    │   │   ├── order/
    │   │   │   └── index.vue
    │   │   ├── wish-list/
    │   │   │   └── index.vue
    │   │   └── index.vue
    │   ├── Cart/
    │   │   ├── checkout/
    │   │   │   ├── thank-you/
    │   │   │   └── index.vue
    │   │   └── index.vue
    │   ├── category/
    │   │   └── [category].vue
    │   ├── Dashboard/
    │   │   └── index.vue
    │   ├── forgot-password/
    │   │   └── index.vue
    │   ├── Login/
    │   │   ├── login-success/
    │   │   │   ├── [id].vue
    │   │   │   └── index.vue
    │   │   └── index.vue
    │   ├── Product/
    │   │   ├── [slug].vue
    │   │   └── index.vue
    │   ├── Register/
    │   │   └── index.vue
    │   ├── search/
    │   │   ├── [keyword].vue
    │   │   └── index.vue
    │   ├── [...all].vue
    │   └── index.vue
    ├── plugins/
    │   ├── axios/
    │   │   ├── axios.ts
    │   │   └── interceptors.ts
    │   ├── fontAwesomeIcons.ts
    │   └── index.ts
    ├── router/
    │   └── index.ts
    ├── store/
    │   ├── auth/
    │   │   ├── index.ts
    │   │   └── state.ts
    │   ├── cart/
    │   │   ├── index.ts
    │   │   └── state.ts
    │   └── index.ts
    ├── stories/
    │   └── index.ts
    ├── types/
    │   ├── address.type.ts
    │   ├── auth.type.ts
    │   ├── brand.type.ts
    │   ├── cart.type.ts
    │   ├── category.types.ts
    │   ├── error.type.ts
    │   ├── order.type.ts
    │   ├── payment.type.ts
    │   ├── product.types.ts
    │   └── user.types.ts
    ├── utils/
    │   ├── filter-sort/
    │   ├── product/
    │   │   ├── getListVariant.ts
    │   │   ├── getPriceAfterDiscount.ts
    │   │   ├── getPriceByVariant.ts
    │   │   └── getTotalPrice.ts
    │   ├── brands.ts
    │   ├── breackpoints.ts
    │   ├── constants.ts
    │   ├── formatMoney.ts
    │   ├── formatTime.ts
    │   └── getNameCategory.ts
    ├── App.vue
    ├── auto-imports.d.ts
    ├── env.d.ts
    └── main.ts
    ## Chuẩn giao diện
- Phong cách giống Cellphones.com.vn
- Có responsive đầy đủ
- Sử dụng component chia nhỏ: `Header.vue`, `Footer.vue`, `ProductGrid.vue`, `BannerSlider.vue`

## Kết nối API Gateway
import axios, { AxiosInstance } from "axios";
import interceptors from "./interceptors";

// --- User Service (auth, profile) ---
const userAxios: AxiosInstance = axios.create({
  baseURL: "http://localhost:3005/api", // User Service
  timeout: 10000,
});

// --- Product Service ---
const productAxios: AxiosInstance = axios.create({
  baseURL: "http://localhost:3001/api", // Product Service
  timeout: 10000,
});

// --- Cart Service ---
const cartAxios: AxiosInstance = axios.create({
  baseURL: "http://localhost:3003/api", // Cart Service
  timeout: 10000,
});

// --- Common fallback axios (no baseURL) ---
export const _axios: AxiosInstance = axios.create({
  timeout: 3000,
});

// Gắn interceptors (nếu bạn có token middleware)
interceptors(userAxios);
interceptors(productAxios);
interceptors(cartAxios);

// Xuất ra để import nơi khác
export const $axios = userAxios;
export { productAxios, cartAxios };
