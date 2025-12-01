# 🎯 HƯỚNG DẪN PHỎNG VẤN VUE.JS - DỰ ÁN SMARTBUY

> **Mục tiêu**: Chuẩn bị câu trả lời cho phỏng vấn Vue.js Fresher với ví dụ thực tế từ dự án của bạn

---

## 📚 MỤC LỤC

1. [Vòng đời Component (Lifecycle Hooks)](#1-vòng-đời-component-lifecycle-hooks)
2. [Hệ thống phản ứng (Reactivity)](#2-hệ-thống-phản-ứng-reactivity)
3. [Computed vs Watchers](#3-computed-vs-watchers)
4. [Props & Events (Giao tiếp Component)](#4-props--events-giao-tiếp-component)
5. [Composables (Tái sử dụng Logic)](#5-composables-tái-sử-dụng-logic)
6. [State Management](#6-state-management)

---

## 1. Vòng đời Component (Lifecycle Hooks)

### 📖 Lý thuyết cơ bản

**Lifecycle Hooks** là các hàm đặc biệt được Vue.js gọi tại các thời điểm khác nhau trong "cuộc đời" của component.

**Thứ tự chạy (Composition API)**:
```
1. setup() - Chạy trước tất cả
2. onBeforeMount() - Trước khi gắn vào DOM
3. onMounted() - SAU KHI component đã xuất hiện trên màn hình ⭐ (Quan trọng nhất)
4. onBeforeUpdate() - Trước khi data thay đổi làm DOM cập nhật
5. onUpdated() - Sau khi DOM được cập nhật
6. onBeforeUnmount() - Trước khi component bị hủy
7. onUnmounted() - Sau khi component bị hủy
```

### 🎯 Ví dụ thực tế từ dự án SmartBuy

#### **File: `ProductReviews.vue` (Component hiển thị đánh giá sản phẩm)**

```vue
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const reviews = ref<Review[]>([]);
const loading = ref(false);
const currentPage = ref(1);

// ✅ onMounted: Gọi API ngay khi component xuất hiện trên màn hình
onMounted(() => {
  loadReviews(); // Tải danh sách đánh giá từ server
});

// ✅ watch: Theo dõi sự thay đổi của currentPage
watch(currentPage, () => {
  loadReviews(); // Khi user chuyển trang → gọi lại API
});

const loadReviews = async () => {
  loading.value = true;
  const response = await getReviewsByProduct(props.productId, {
    page: currentPage.value,
    limit: 5
  });
  reviews.value = response.data.reviews;
  loading.value = false;
};
</script>
```

### 💬 Câu hỏi phỏng vấn & Cách trả lời

**Q1: "Khi nào bạn dùng `onMounted()`?"**

**Trả lời**:
> "Trong dự án SmartBuy, em dùng `onMounted()` để gọi API. Ví dụ ở component `ProductReviews.vue`, em cần tải danh sách đánh giá từ server ngay khi component xuất hiện. Nếu em gọi API ở `setup()`, DOM chưa sẵn sàng, nên em đặt trong `onMounted()` để đảm bảo component đã render xong."

**Q2: "Tại sao không gọi API ngay trong `setup()`?"**

**Trả lời**:
> "`setup()` chạy RẤT SỚM, trước cả khi component render. Nếu API trả về lâu và em cần thao tác với DOM (ví dụ focus vào ô input), thì phải dùng `onMounted()`. Nhưng nếu chỉ cần fetch data không liên quan DOM, thì gọi ngay trong `setup()` cũng được."

---

## 2. Hệ thống phản ứng (Reactivity)

### 📖 Lý thuyết cơ bản

Vue.js tự động **theo dõi** biến và **cập nhật giao diện** khi biến thay đổi.

**2 cách tạo biến reactive**:
- `ref()`: Dùng cho giá trị đơn giản (số, chuỗi, boolean)
- `reactive()`: Dùng cho object/array

### 🎯 Ví dụ thực tế từ SmartBuy

#### **File: `WriteReviewModal.vue` (Form viết đánh giá)**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

// ✅ ref() - Biến đơn giản
const rating = ref(0);           // Số sao đánh giá (0-5)
const comment = ref('');         // Nội dung đánh giá
const hoverRating = ref(0);      // Sao đang hover
const selectedImages = ref<File[]>([]); // Mảng file ảnh

// ✅ computed - Tính toán từ ref
const isValid = computed(() => {
  return rating.value > 0 && comment.value.length >= 15;
});

// ✅ Hàm thay đổi giá trị → Vue tự động update UI
const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    selectedImages.value = Array.from(files); // ← Vue tự động render lại
  }
};
</script>

<template>
  <!-- ✅ Vue tự động cập nhật màu sao khi hover -->
  <button
    v-for="star in 5"
    @mouseenter="hoverRating = star"
    @mouseleave="hoverRating = 0"
    :class="star <= (hoverRating || rating) ? 'tw-text-amber-400' : 'tw-text-gray-300'"
  >
    ★
  </button>

  <!-- ✅ Button chỉ enable khi form hợp lệ -->
  <button :disabled="!isValid">Gửi đánh giá</button>
</template>
```

### 💬 Câu hỏi phỏng vấn

**Q: "Khi nào dùng `ref()` và khi nào dùng `reactive()`?"**

**Trả lời**:
> "Trong dự án SmartBuy, em dùng `ref()` cho các biến đơn giản như `rating` (số sao), `comment` (chuỗi). Còn `reactive()` em dùng cho object phức tạp như `formData = reactive({ name: '', email: '' })`. Lý do là `ref()` phải truy cập qua `.value`, còn `reactive()` truy cập trực tiếp. Nhưng `reactive()` không theo dõi được khi bạn gán lại toàn bộ object."

**Code minh họa**:
```js
// ❌ SAI - reactive() mất tính reactive khi gán lại
let form = reactive({ name: 'John' });
form = { name: 'Jane' }; // ← Mất reactivity!

// ✅ ĐÚNG - ref() vẫn reactive khi gán lại
let form = ref({ name: 'John' });
form.value = { name: 'Jane' }; // ← Vẫn reactive!
```

---

## 3. Computed vs Watchers

### 📖 Lý thuyết

| **Computed** | **Watch** |
|-------------|-----------|
| Tính toán giá trị MỚI từ data cũ | Chạy side-effect khi data thay đổi |
| Có cache (chỉ tính lại khi dependency thay đổi) | Không có cache |
| **Dùng khi**: Hiển thị giá trị phụ thuộc | **Dùng khi**: Gọi API, log, thay đổi data khác |

### 🎯 Ví dụ từ SmartBuy

#### **File: `useCart.ts` (Composable quản lý giỏ hàng)**

```ts
import { computed, watch } from 'vue';

// ✅ COMPUTED: Tính tổng tiền giỏ hàng
const totalPrice = computed(() => {
  return cart.value?.finalTotal || cart.value?.total || 0;
});

// ✅ COMPUTED: Tính tổng số lượng sản phẩm
const totalItems = computed(() => {
  return cart.value?.itemCount || cartCount.value?.data?.count || 0;
});

// ✅ COMPUTED: Kiểm tra giỏ hàng có rỗng không
const isEmpty = computed(() => {
  return cartItems.value.length === 0;
});

// ✅ WATCH: Khi currentPage thay đổi → Gọi API load reviews
watch(currentPage, () => {
  loadReviews(); // Side-effect: Fetch data từ server
});

// ✅ WATCH: Khi selectedFilter thay đổi → Reset trang về 1
watch(selectedFilter, () => {
  currentPage.value = 1;
  loadReviews();
});
```

### 💬 Câu hỏi phỏng vấn

**Q: "Khác nhau giữa `computed` và `watch`? Khi nào dùng cái nào?"**

**Trả lời**:
> "Em dùng `computed` khi cần **tính toán giá trị mới** để hiển thị. Ví dụ trong SmartBuy, `totalPrice` tính tổng tiền giỏ hàng từ `cart.items`. Còn `watch` em dùng khi cần **làm gì đó** khi data thay đổi, ví dụ gọi API. Như trong `ProductReviews.vue`, khi user chuyển trang (`currentPage` thay đổi), em dùng `watch` để gọi API tải reviews mới."

**Ví dụ SAI (Dễ nhầm)**:
```js
// ❌ SAI: Dùng watch để tính toán → Không có cache, chạy nhiều lần không cần thiết
watch(() => cart.value, () => {
  totalPrice.value = cart.value.items.reduce((sum, item) => sum + item.price, 0);
});

// ✅ ĐÚNG: Dùng computed → Tự động cache, chỉ tính lại khi cart thay đổi
const totalPrice = computed(() => {
  return cart.value.items.reduce((sum, item) => sum + item.price, 0);
});
```

---

## 4. Props & Events (Giao tiếp Component)

### 📖 Lý thuyết

- **Props**: Cha truyền data xuống Con (One-way data flow)
- **Events (emit)**: Con báo ngược lên Cha

### 🎯 Ví dụ từ SmartBuy

#### **Component Cha: `Product/[slug].vue`**
```vue
<script setup lang="ts">
const showAddToCartModal = ref(false);
const addedProductInfo = ref(null);

const handleAddToCart = async () => {
  // Logic thêm sản phẩm vào giỏ
  addedProductInfo.value = { name: 'iPhone 15', price: 20000000 };
  showAddToCartModal.value = true; // ← Hiện modal con
};

const handleUpdateQuantity = (newQty: number) => {
  console.log('Con báo Cha: Số lượng mới là', newQty);
  // Cập nhật lại số lượng trong giỏ hàng
};
</script>

<template>
  <!-- ✅ Cha truyền Props xuống Con -->
  <AddToCartModal
    :is-open="showAddToCartModal"
    :product-info="addedProductInfo"
    :total-items="totalItems"
    @close="showAddToCartModal = false"          <!-- ✅ Con emit "close" lên Cha -->
    @update-quantity="handleUpdateQuantity"       <!-- ✅ Con emit "update-quantity" lên Cha -->
  />
</template>
```

#### **Component Con: `AddToCartModal.vue`**
```vue
<script setup lang="ts">
// ✅ Nhận Props từ Cha
interface Props {
  isOpen: boolean;
  productInfo: any;
  totalItems: number;
}
const props = defineProps<Props>();

// ✅ Định nghĩa Events để báo lên Cha
const emit = defineEmits<{
  close: [];
  'update-quantity': [quantity: number];
}>();

// ✅ Con gọi emit để báo Cha
const closeModal = () => {
  emit('close'); // ← Báo Cha đóng modal
};

const changeQuantity = (newQty: number) => {
  emit('update-quantity', newQty); // ← Báo Cha cập nhật số lượng
};
</script>

<template>
  <div v-if="props.isOpen">
    <h2>{{ props.productInfo.name }}</h2>
    <button @click="closeModal">Đóng</button>
    <button @click="changeQuantity(2)">Tăng số lượng</button>
  </div>
</template>
```

### 💬 Câu hỏi phỏng vấn

**Q: "Props và Events hoạt động như thế nào? Cho ví dụ trong dự án?"**

**Trả lời**:
> "Trong SmartBuy, em có component `AddToCartModal` (con) được gọi từ `Product/[slug].vue` (cha). Cha truyền Props như `isOpen`, `productInfo` xuống con để con biết có hiển thị không. Khi user bấm nút 'Đóng' trong modal, con không tự đóng được vì `isOpen` do cha quản lý. Nên con emit event `close` lên cha, cha nhận event và set `showAddToCartModal = false`. Đây là **one-way data flow** của Vue."

**Q: "Tại sao không cho Con tự sửa Props?"**

**Trả lời**:
> "Vì Vue áp dụng **one-way data flow**. Nếu con tự sửa props, sẽ khó debug khi có nhiều component. Ví dụ nếu `AddToCartModal` tự set `props.isOpen = false`, thì cha không biết modal đã đóng, có thể gây bug khi cha cần xử lý logic khác sau khi đóng."

---

## 5. Composables (Tái sử dụng Logic)

### 📖 Lý thuyết

**Composable** = Hàm chứa logic Vue có thể tái sử dụng ở nhiều component.

**Đặt tên**: `useXXX()` (ví dụ: `useCart()`, `useAuth()`)

### 🎯 Ví dụ từ SmartBuy

#### **File: `composables/useCart.ts`**

```ts
import { ref, computed } from 'vue';
import { getCart, addToCart as addToCartApi } from '@/api/cart/cart';

export const useCart = () => {
  // ✅ State quản lý giỏ hàng
  const cart = ref(null);
  const isLoadingCart = ref(false);
  
  // ✅ Computed: Tính tổng tiền
  const totalPrice = computed(() => {
    return cart.value?.finalTotal || 0;
  });
  
  // ✅ Computed: Tính tổng số sản phẩm
  const totalItems = computed(() => {
    return cart.value?.itemCount || 0;
  });
  
  // ✅ Action: Thêm sản phẩm vào giỏ
  const addToCart = async (payload) => {
    isLoadingCart.value = true;
    try {
      await addToCartApi(payload);
      alert('✅ Đã thêm vào giỏ hàng!');
    } catch (error) {
      alert('❌ Lỗi thêm sản phẩm!');
    } finally {
      isLoadingCart.value = false;
    }
  };
  
  // ✅ Return để component khác dùng
  return {
    cart,
    totalPrice,
    totalItems,
    isLoadingCart,
    addToCart,
  };
};
```

#### **Sử dụng trong Component**

```vue
<script setup lang="ts">
import { useCart } from '@/composables/useCart';

// ✅ Gọi composable
const { totalItems, totalPrice, addToCart, isLoadingCart } = useCart();

const handleAddToCart = async () => {
  await addToCart({
    productId: '123',
    variantId: '456',
    quantity: 1
  });
};
</script>

<template>
  <div>
    <p>Giỏ hàng: {{ totalItems }} sản phẩm</p>
    <p>Tổng tiền: {{ totalPrice }} VNĐ</p>
    <button @click="handleAddToCart" :disabled="isLoadingCart">
      Thêm vào giỏ
    </button>
  </div>
</template>
```

### 💬 Câu hỏi phỏng vấn

**Q: "Composable là gì? Tại sao dùng nó?"**

**Trả lời**:
> "Composable là hàm chứa logic Vue có thể dùng lại. Trong SmartBuy, em tạo `useCart()` để quản lý giỏ hàng. Logic như `addToCart`, `totalPrice` được viết một lần trong composable, rồi nhiều component khác nhau (Product Detail, Cart Page, Navbar) đều gọi `useCart()` để dùng. Nếu không có composable, em phải copy-paste logic này vào từng component, khó bảo trì."

**Q: "Composable khác gì với Store (Pinia)?"**

**Trả lời**:
> "Composable dùng cho logic component-level (ví dụ: form validation, fetch data). Store (Pinia) dùng cho state global toàn app (ví dụ: user đăng nhập, giỏ hàng). Trong SmartBuy, em dùng `useCart()` composable để gọi API, còn store Pinia để lưu cart state toàn app, các component khác nhau đều thấy cùng một giỏ hàng."

---

## 6. State Management (Pinia/Vuex)

### 📖 Lý thuyết

**State Management** = Quản lý state chung cho toàn bộ app (thay vì truyền Props lồng nhau).

**Khi nào cần**:
- User đăng nhập → Nhiều component cần biết thông tin user
- Giỏ hàng → Hiển thị số lượng ở Header, Product Page, Cart Page
- Theme (Dark/Light mode) → Tất cả component cần biết

### 🎯 Ví dụ từ SmartBuy (Giả định dùng Pinia)

#### **File: `store/cart.ts` (Store quản lý giỏ hàng)**

```ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  // ✅ State
  const cart = ref(null);
  const isLoading = ref(false);
  
  // ✅ Getters (như computed)
  const totalItems = computed(() => {
    return cart.value?.itemCount || 0;
  });
  
  const totalPrice = computed(() => {
    return cart.value?.finalTotal || 0;
  });
  
  // ✅ Actions
  const fetchCart = async () => {
    isLoading.value = true;
    const response = await getCart();
    cart.value = response.data.cart;
    isLoading.value = false;
  };
  
  const addItem = async (payload) => {
    await addToCartApi(payload);
    await fetchCart(); // Refresh cart sau khi thêm
  };
  
  return {
    cart,
    totalItems,
    totalPrice,
    isLoading,
    fetchCart,
    addItem,
  };
});
```

#### **Sử dụng Store trong Component**

```vue
<script setup lang="ts">
import { useCartStore } from '@/store/cart';

const cartStore = useCartStore();

// ✅ Gọi action từ store
cartStore.fetchCart();

// ✅ Đọc state từ store
console.log(cartStore.totalItems); // → 5
</script>

<template>
  <div>
    <p>Giỏ hàng: {{ cartStore.totalItems }} sản phẩm</p>
    <p>Tổng tiền: {{ cartStore.totalPrice }} VNĐ</p>
  </div>
</template>
```

### 💬 Câu hỏi phỏng vấn

**Q: "Tại sao cần Store? Không dùng Props được sao?"**

**Trả lời**:
> "Nếu không có Store, em phải truyền Props từ component ông → cha → con → cháu (gọi là **Prop Drilling**). Ví dụ trong SmartBuy, thông tin giỏ hàng cần hiển thị ở Header (số lượng), Product Page (nút thêm giỏ), Cart Page (danh sách). Nếu dùng Props, em phải truyền từ App.vue → Header/Product/Cart, rất phức tạp. Với Store, tất cả component gọi `useCartStore()` và lấy data ngay, không cần truyền Props."

**Q: "Pinia khác gì Vuex?"**

**Trả lời**:
> "Pinia là phiên bản mới hơn, đơn giản hơn Vuex. Vuex dùng `mutations` (synchronous) và `actions` (async), còn Pinia chỉ có `actions` (cả sync và async). Pinia cũng hỗ trợ TypeScript tốt hơn. Trong SmartBuy, nếu dùng Pinia, code sẽ ngắn gọn hơn."

---

## 🎓 CHIẾN THUẬT PHỎNG VẤN

### 1. **Chuẩn bị trước câu hỏi "Giải thích code này trong dự án của bạn"**

Nhà tuyển dụng CHẮC CHẮN sẽ hỏi:
> "Em giải thích đoạn code này trong file `WriteReviewModal.vue` làm gì?"

**Cách trả lời**:
1. **Mô tả chức năng**: "Đây là modal để user viết đánh giá sản phẩm"
2. **Giải thích kỹ thuật**: "Em dùng `ref()` để quản lý `rating` và `comment`, dùng `computed` để validate form"
3. **Kết quả**: "Khi user bấm 'Gửi', em emit event lên component cha để gọi API lưu đánh giá"

### 2. **Vẽ sơ đồ Lifecycle trên giấy (Ngay tại buổi phỏng vấn)**

Nếu họ hỏi "Lifecycle chạy như thế nào?", hãy vẽ:
```
  setup()
    ↓
onBeforeMount()
    ↓
  onMounted() ← Gọi API ở đây
    ↓
  (User thay đổi data)
    ↓
onBeforeUpdate()
    ↓
  onUpdated()
```

### 3. **Chuẩn bị câu "Em gặp bug gì và fix thế nào?"**

Ví dụ từ SmartBuy:
> "Em gặp bug là khi user thêm sản phẩm vào giỏ, số lượng ở Header không tự động cập nhật. Em debug và phát hiện là em quên gọi `refetchCartCount()` sau khi `addToCart()`. Sau khi thêm dòng này, bug đã fix."

### 4. **Nắm vững 3 khái niệm này**

- **Reactivity**: Biến thay đổi → UI tự động update
- **One-way data flow**: Cha truyền Props xuống Con, Con emit Events lên Cha
- **Composable**: Tái sử dụng logic giữa các component

---

## 📌 CHECKLIST ÔN TẬP TRƯỚC PHỎNG VẤN

- [ ] Đọc lại file `WriteReviewModal.vue` → Giải thích được từng dòng code
- [ ] Đọc lại file `useCart.ts` → Giải thích được tại sao dùng composable
- [ ] Đọc lại file `Product/[slug].vue` → Giải thích Props & Events
- [ ] Vẽ lại sơ đồ Lifecycle Hooks trên giấy
- [ ] Chuẩn bị câu trả lời cho "Ref vs Reactive"
- [ ] Chuẩn bị câu trả lời cho "Computed vs Watch"
- [ ] Chuẩn bị câu "Em gặp bug gì trong dự án và fix thế nào?"

---

## 🔗 TÀI LIỆU THAM KHẢO

### Tài liệu chính thức Vue.js (Tiếng Anh - NÊN ĐỌC)
1. **Lifecycle Hooks**: https://vuejs.org/guide/essentials/lifecycle.html
2. **Reactivity Fundamentals**: https://vuejs.org/guide/essentials/reactivity-fundamentals.html
3. **Computed Properties**: https://vuejs.org/guide/essentials/computed.html
4. **Watchers**: https://vuejs.org/guide/essentials/watchers.html
5. **Props**: https://vuejs.org/guide/components/props.html
6. **Events**: https://vuejs.org/guide/components/events.html
7. **Composables**: https://vuejs.org/guide/reusability/composables.html

### Tài liệu Pinia (State Management)
8. **Pinia Introduction**: https://pinia.vuejs.org/introduction.html

---

## 🚀 BƯỚC TIẾP THEO

1. **Hôm nay**: Đọc lại code trong dự án SmartBuy, hiểu rõ từng file
2. **Ngày mai**: Tạo file Vue mới, tự viết lại `ref`, `computed`, `watch` để thực hành
3. **2 ngày trước phỏng vấn**: Vẽ lại sơ đồ Lifecycle trên giấy, thuộc lòng
4. **1 ngày trước phỏng vấn**: Chuẩn bị câu trả lời cho từng mục trong tài liệu này

---

**Chúc bạn phỏng vấn thành công! 🎯**
