import { $axios } from '@/plugins/axios/axios'

/**
 * Lấy top sản phẩm bán chạy
 */
export const getTopSellingProducts = async (params: {
  limit?: number
}) => {
  const response = await $axios.get('/products/stats/top-selling', { params })
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
