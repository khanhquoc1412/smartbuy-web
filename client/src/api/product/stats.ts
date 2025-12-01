import { $axios } from '@/plugins/axios/axios'

/**
 * Lấy top sản phẩm bán chạy từ orders thực tế
 */
export const getTopSellingProducts = async (params: {
  limit?: number
  dateRange?: '7days' | '30days' | '90days' | 'year'
}) => {
  // Gọi endpoint mới từ order-manager-service để lấy data thực
  const response = await $axios.get('/orders/stats/top-selling-products', { params })
  return response
}

/**
 * Lấy doanh thu theo danh mục
 */
export const getRevenueByCategory = async () => {
  const response = await $axios.get('/products/stats/by-category')
  return response
}

/**
 * Lấy thống kê tồn kho
 */
export const getInventoryStatus = async (params?: {
  lowThreshold?: number
  highThreshold?: number
}) => {
  const response = await $axios.get('/products/stats/inventory', { params })
  return response
}

/**
 * Lấy tổng quan sản phẩm
 */
export const getProductsOverview = async () => {
  const response = await $axios.get('/products/stats/overview')
  return response
}
