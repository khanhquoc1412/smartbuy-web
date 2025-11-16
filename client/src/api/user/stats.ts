import { $axios } from '@/plugins/axios/axios'

/**
 * Lấy tổng quan khách hàng
 */
export const getUsersOverview = async (params: {
  dateRange?: '7days' | '30days' | '90days' | 'year' | 'custom'
  startDate?: string
  endDate?: string
}) => {
  const response = await $axios.get('/users/stats/overview', { params })
  return response
}

/**
 * Lấy phân khúc khách hàng
 */
export const getCustomerSegments = async () => {
  const response = await $axios.get('/users/stats/segments')
  return response
}

/**
 * Lấy top khách hàng VIP
 */
export const getTopCustomers = async (params: {
  limit?: number
}) => {
  const response = await $axios.get('/users/stats/top-customers', { params })
  return response
}

/**
 * Lấy hoạt động người dùng theo thời gian
 */
export const getUserActivity = async (params: {
  dateRange?: '7days' | '30days' | '90days' | 'year'
  groupBy?: 'day' | 'week' | 'month'
}) => {
  const response = await $axios.get('/users/stats/activity', { params })
  return response
}
