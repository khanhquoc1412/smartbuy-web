# Review Service - Changelog

## Latest Updates - Product Name Display & Filtering

### 🎯 Overview
Loại bỏ trường `isVerifiedPurchase` không cần thiết và thêm khả năng hiển thị tên sản phẩm cùng bộ lọc theo sản phẩm.

### 📦 Backend Changes

#### Model Updates (`src/models/review.js`)
- ❌ **Removed**: `isVerifiedPurchase` field (Boolean)
- ✅ **Added**: `productName` field (String, required)
- Updated validation and indexes

#### Controller Updates (`src/controllers/reviewController.js`)
**`getAllReviews()` endpoint enhancements:**
- ✅ Added `productName` filter parameter (case-insensitive regex search)
- ✅ Added `search` parameter for searching by userName or comment
- 📊 Supports filtering by: `rating`, `isVisible`, `search`, `productName`

**Query Parameters:**
```javascript
{
  page: 1,
  limit: 10,
  rating: 5,
  isVisible: true,
  search: "text to search",
  productName: "iPhone" // NEW - filter by product name
}
```

#### Seed Data (`seed.js`)
Created comprehensive test data:
- 📱 **12 sample reviews** across 5 products
- 🎯 Products: iPhone 15 Pro Max, Samsung Galaxy S24 Ultra, Xiaomi 14 Pro, OPPO Find X7 Ultra, Realme GT 5 Pro
- ⭐ Mixed ratings (1-5 stars)
- 👁️ 10 visible + 2 hidden reviews with reasons
- 🖼️ Sample images from picsum.photos
- 💬 Realistic Vietnamese comments

**Run seed:**
```bash
cd server/review-service
node seed.js
```

### 🎨 Frontend Changes

#### API Interface Updates (`client/src/api/review/review.ts`)
**Review Interface:**
```typescript
interface Review {
  _id: string;
  userId: string;
  productId: string;
  productName: string; // ✅ NEW
  rating: number;
  comment: string;
  userName: string;
  images: string[];
  helpfulCount: number;
  isVisible: boolean;
  hiddenReason?: string;
  hiddenBy?: string;
  hiddenAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // isVerifiedPurchase removed ❌
}
```

#### Admin UI Updates (`client/src/pages/admin/reviews.vue`)

**Filter Section:**
- ❌ **Removed**: "Filter by Verified Purchase" dropdown
- ✅ **Added**: Product name text input with debounced search (500ms delay)
- 🔍 Clear button when filter has value
- 🎨 Modern search icon UI

**Table Updates:**
- 📊 Added "Sản phẩm" (Product) column showing:
  - Product name (bold)
  - Product ID (gray, small text)
- ❌ Removed isVerifiedPurchase badge display

**State Management:**
```typescript
// Removed
const selectedVerified = ref<boolean | null>(null);
const selectVerified = (verified: boolean) => {...}

// Added
const productFilter = ref('');
const handleProductFilterChange = () => {
  // Debounced search with 500ms delay
  pagination.value.page = 1;
  loadReviews();
};
```

**Updated Functions:**
- `loadReviews()`: Added `productName` parameter
- `resetFilters()`: Clears productFilter instead of selectedVerified

### 🧪 Testing

1. **Start services:**
```bash
# Review Service
cd server/review-service
npm start # Port 5006

# API Gateway
cd server/api-gateway
npm run dev # Port 3000
```

2. **Populate test data:**
```bash
cd server/review-service
node seed.js
```

3. **Test in Admin UI:**
- Navigate to `/admin/reviews`
- Try filtering by product name: "iPhone", "Samsung", "Xiaomi"
- Verify debounced search (500ms delay)
- Check table shows product names correctly

### 📝 Migration Notes

**Database Migration:**
- Existing reviews will still work but won't have `productName`
- Consider running update script to populate `productName` from product service
- `isVerifiedPurchase` field is ignored (can be removed from existing documents)

**Frontend:**
- Remove any references to `isVerifiedPurchase` in product detail pages
- Update review form to include product name when submitting

### 🔄 API Response Structure

```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "_id": "...",
        "productName": "iPhone 15 Pro Max",
        "productId": "676cc3b0ec26c7e8f1ceec89",
        "userName": "Nguyễn Văn A",
        "rating": 5,
        "comment": "Sản phẩm tuyệt vời!",
        "isVisible": true,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "currentPage": 1,
    "totalPages": 2,
    "total": 12,
    "limit": 10
  }
}
```

### ✅ Completed Tasks
- [x] Remove `isVerifiedPurchase` from model
- [x] Add `productName` field to model
- [x] Update controller to support `productName` filtering
- [x] Remove verified purchase filter from admin UI
- [x] Add product name input filter with debounce
- [x] Update table to show product information
- [x] Create seed data with 12 sample reviews
- [x] Update API interfaces and types
- [x] Test productName filtering functionality

### 🎉 Result
Admin có thể dễ dàng xem và lọc đánh giá theo tên sản phẩm, giúp quản lý review hiệu quả hơn!
