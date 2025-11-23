import { $axios } from '@/plugins/axios/axios'

/**
 * Lấy tổng quan thống kê: doanh thu, đơn hàng, khách hàng, AOV
 */
export const getOrdersOverview = async (params: {
  dateRange?: '7days' | '30days' | '90days' | 'year' | 'custom'
  startDate?: string
  endDate?: string
}) => {
  const response = await $axios.get('/orders/stats/overview', { params })
  return response // ✅ Interceptor đã return response.data rồi
}

/**
 * Lấy doanh thu theo timeline
 */
export const getRevenueTimeline = async (params: {
  dateRange?: '7days' | '30days' | '90days' | 'year' | 'custom'
  startDate?: string
  endDate?: string
  groupBy?: 'hour' | 'day' | 'week' | 'month'
}) => {
  const response = await $axios.get('/orders/stats/revenue-timeline', { params })
  return response
}

/**
 * Lấy thống kê đơn hàng theo trạng thái
 */
export const getOrdersByStatus = async (params: {
  dateRange?: '7days' | '30days' | '90days' | 'year' | 'custom'
  startDate?: string
  endDate?: string
}) => {
  const response = await $axios.get('/orders/stats/by-status', { params })
  return response
}

/**
 * Lấy phân tích giờ cao điểm
 */
export const getPeakHours = async (params: {
  dateRange?: '7days' | '30days' | '90days' | 'year' | 'custom'
  startDate?: string
  endDate?: string
}) => {
  const response = await $axios.get('/orders/stats/peak-hours', { params })
  return response
}

/**
 * Lấy thống kê phương thức thanh toán
 */
export const getPaymentMethods = async (params: {
  dateRange?: '7days' | '30days' | '90days' | 'year' | 'custom'
  startDate?: string
  endDate?: string
}) => {
  const response = await $axios.get('/orders/stats/payment-methods', { params })
  return response
}
