# DashboardKit Customizer Component

Component customizer giao diện admin theo phong cách DashboardKit với 7 tùy chọn chính.

## Tính năng

### 1. **Theme Mode** (3 chế độ)
- ☀️ Light - Giao diện sáng
- 🌙 Dark - Giao diện tối
- ⚙️ Auto - Mặc định hệ thống

### 2. **Accent Color** (10 màu)
- Indigo, Purple, Pink, Rose, Orange, Amber, Green, Teal, Cyan, Red
- Preview real-time với CSS variables
- Checkmark hiển thị màu đang chọn

### 3. **Sidebar Theme** (2 tùy chọn)
- Dark - Sidebar nền tối
- Light - Sidebar nền sáng
- Visual preview cards

### 4. **Sidebar Caption** (2 tùy chọn)
- Caption Show - Hiển thị tiêu đề phần
- Caption Hide - Ẩn tiêu đề phần
- Visual preview với mini sidebar

### 5. **Header Theme** (2 tùy chọn)
- Dark - Header nền tối (gradient crimson)
- Light - Header nền sáng (gradient slate)
- Thay đổi màu text và hover

### 6. **Layout Direction** (2 tùy chọn)
- LTR - Left to Right (trái sang phải)
- RTL - Right to Left (phải sang trái)
- Visual preview với sidebar position

### 7. **Layout Width** (2 tùy chọn)
- Full Width - Chiều rộng 100%
- Fixed Width - Chiều rộng cố định 1400px (boxed)
- Visual preview với container

## Cách sử dụng

```vue
<template>
  <DashboardCustomizer 
    :isOpen="showCustomizer" 
    @close="showCustomizer = false"
    @save="handleCustomizerSave"
  />
</template>

<script setup>
import DashboardCustomizer from '@/components/common/DashboardCustomizer.vue'

const showCustomizer = ref(false)

function handleCustomizerSave(settings) {
  console.log('New settings:', settings)
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | Boolean | `false` | Hiển thị/ẩn customizer panel |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | - | Đóng customizer panel |
| `save` | `settings` Object | Lưu cài đặt và đóng panel |

## Settings Object

```typescript
interface Settings {
  themeMode: 'light' | 'dark' | 'auto'
  accentColor: string // 'indigo', 'purple', etc.
  sidebarTheme: 'dark' | 'light'
  sidebarCaption: boolean
  headerTheme: 'dark' | 'light'
  layoutDirection: 'ltr' | 'rtl'
  layoutWidth: 'full' | 'boxed'
}
```

## localStorage Keys

Settings được lưu tự động vào localStorage:
- `themeMode`
- `accentColor`
- `sidebarTheme`
- `sidebarCaption`
- `headerTheme`
- `layoutDirection`
- `layoutWidth`

## CSS Variables

Component áp dụng các CSS variables sau:
- `--primary-color` - Màu accent chính

## Data Attributes

Component áp dụng data attributes lên `<html>`:
- `data-sidebar-theme="dark|light"`
- `data-header-theme="dark|light"`
- `data-layout-width="full|boxed"`
- `dir="ltr|rtl"`

## Styling

Định nghĩa CSS cho data attributes trong parent layout (admin.vue):

```css
/* Sidebar Dark Theme */
[data-sidebar-theme="dark"] aside {
  background-color: #1a202c !important;
  color: #fff !important;
}

/* Header Light Theme */
[data-header-theme="light"] header {
  background: linear-gradient(to right, #f8fafc, #f1f5f9) !important;
}

/* Boxed Layout */
[data-layout-width="boxed"] main {
  max-width: 1400px !important;
  margin: 0 auto !important;
}

/* RTL Layout */
[dir="rtl"] {
  direction: rtl !important;
}
```

## Features

- ✅ Live preview - Thay đổi ngay lập tức
- ✅ localStorage persistence - Lưu tự động
- ✅ Visual cards - Preview rõ ràng
- ✅ Smooth animations - slideIn effect
- ✅ Responsive design - Mobile friendly
- ✅ DashboardKit style - Giao diện chuyên nghiệp
- ✅ Custom scrollbar - Cuộn đẹp
- ✅ Reset functionality - Đặt lại mặc định

## Browser Support

- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅

## Dependencies

- Vue 3 Composition API
- Tailwind CSS (tw-* classes)
- localStorage API
