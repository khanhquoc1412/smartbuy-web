import { $axios } from '@/plugins/axios/axios';

export interface Review {
  _id: string;
  userId: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  userName: string;
  images: string[];
  helpfulCount: number;
  helpfulBy?: string[];
  isVisible: boolean;
  hiddenReason?: string;
  hiddenBy?: string;
  hiddenAt?: Date;
  adminReply?: string;
  adminReplyBy?: string;
  adminReplyAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  rating5: number;
  rating4: number;
  rating3: number;
  rating2: number;
  rating1: number;
}

export interface ReviewsResponse {
  success: boolean;
  data: {
    reviews: Review[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    stats?: ReviewStats;
  };
}

export interface StatsResponse {
  success: boolean;
  data: {
    overall: {
      totalReviews: number;
      averageRating: number;
      totalHelpful: number;
    };
    byVisibility: {
      visible: number;
      hidden: number;
    };
  };
}

// Lấy tất cả reviews với phân trang và filter
export const getAllReviews = async (params?: {
  page?: number;
  limit?: number;
  rating?: number;
  productId?: string;
  userId?: string;
  isVisible?: boolean;
  search?: string;
}): Promise<ReviewsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.rating) queryParams.append('rating', params.rating.toString());
  if (params?.productId) queryParams.append('productId', params.productId);
  if (params?.userId) queryParams.append('userId', params.userId);
  if (params?.isVisible !== undefined) queryParams.append('isVisible', params.isVisible.toString());
  if (params?.search) queryParams.append('search', params.search);

  return await $axios.get<ReviewsResponse>(`/reviews?${queryParams.toString()}`) as unknown as ReviewsResponse;
};

// Lấy reviews theo sản phẩm
export const getReviewsByProduct = async (productId: string, params?: {
  page?: number;
  limit?: number;
  rating?: number;
  sortBy?: string;
}): Promise<ReviewsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.rating) queryParams.append('rating', params.rating.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

  return await $axios.get<ReviewsResponse>(`/reviews/product/${productId}?${queryParams.toString()}`) as unknown as ReviewsResponse;
};

// Lấy reviews theo user
export const getReviewsByUser = async (userId: string, params?: {
  page?: number;
  limit?: number;
}): Promise<ReviewsResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return await $axios.get<ReviewsResponse>(`/reviews/user/${userId}?${queryParams.toString()}`) as unknown as ReviewsResponse;
};

// Ẩn/hiện review (Admin)
export const toggleReviewVisibility = async (
  reviewId: string,
  data: {
    isVisible: boolean;
    hiddenReason?: string;
    adminId?: string;
  }
) => {
  return await $axios.patch(`/reviews/${reviewId}/visibility`, data) as any;
};

// Xóa review
export const deleteReview = async (reviewId: string) => {
  return await $axios.delete(`/reviews/${reviewId}`) as any;
};

// Lấy thống kê tổng quan
export const getReviewsStats = async (): Promise<StatsResponse> => {
  return await $axios.get<StatsResponse>('/reviews/stats') as unknown as StatsResponse;
};

// Lấy phân bố rating
export const getRatingDistribution = async () => {
  return await $axios.get('/reviews/stats/rating-distribution') as any;
};

// Lấy top sản phẩm được đánh giá nhiều nhất
export const getTopReviewedProducts = async (params?: { limit?: number }) => {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  return await $axios.get(`/reviews/stats/top-products?${queryParams.toString()}`) as any;
};

// Lấy xu hướng đánh giá theo thời gian
export const getReviewTrends = async (params?: { days?: number }) => {
  const queryParams = new URLSearchParams();
  if (params?.days) queryParams.append('days', params.days.toString());
  return await $axios.get(`/reviews/stats/trends?${queryParams.toString()}`) as any;
};

// Lấy thống kê reviews có/không có hình ảnh
export const getImageStats = async () => {
  return await $axios.get('/reviews/stats/images') as any;
};

// Đánh dấu hữu ích
export const markReviewHelpful = async (reviewId: string, userId: string) => {
  return await $axios.post(`/reviews/${reviewId}/helpful`, { userId }) as any;
};

// Tạo review mới
export const createReview = async (data: {
  userId: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  userName: string;
  images?: string[];
}) => {
  return await $axios.post('/reviews', data) as any;
};

// Cập nhật review
export const updateReview = async (reviewId: string, data: {
  rating?: number;
  comment?: string;
  images?: string[];
}) => {
  return await $axios.put(`/reviews/${reviewId}`, data) as any;
};

// Admin phản hồi đánh giá
export const replyReview = async (reviewId: string, data: {
  adminReply: string;
  adminId?: string;
}) => {
  return await $axios.post(`/reviews/${reviewId}/reply`, data) as any;
};
