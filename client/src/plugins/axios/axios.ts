import axios, { AxiosInstance } from "axios";
import interceptors from "./interceptors";

// 🔥 API Gateway URL - Điểm vào duy nhất cho tất cả microservices
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3000';

/**
 * MỘT axios instance duy nhất qua API Gateway
 * 
 * API Gateway sẽ tự động route đến các service tương ứng:
 * - /api/auth/* → User Service (3005)
 * - /api/product/* → Product Service (3001)
 * - /api/products/* → Product-Manager Service (5002)
 * - /api/categories/* → Product-Manager Service (5002)
 * - /api/brands/* → Product-Manager Service (5002)
 * - /api/colors/* → Product-Manager Service (5002)
 * - /api/carts/* → Cart Service (5000 - tạm thời)
 * - /api/brand/* → Brand Service (5000 - tạm thời)
 * - /api/orders/* → Order Service (5003)
 * - /api/locations/* → Location Service (5004)
 * - /api/promotions/* → Promotion Service (5005)
 * - /api/reviews/* → Review Service (5006)
 * - /api/search/* → Search Service (5007)
 * - /api/chatbot/* → Chatbot Service (5008)
 */
const $axios: AxiosInstance = axios.create({
  baseURL: `${API_GATEWAY_URL}/api`, // ✅ Thêm /api prefix
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Gắn interceptors cho authentication token
interceptors($axios);

// Export axios instance duy nhất
export { $axios };

// Backward compatibility - đều trỏ về cùng instance
export const userAxios = $axios;
export const productAxios = $axios;
export const cartAxios = $axios;
export const _axios = axios.create({ timeout: 3000 }); // Cho các external API không qua Gateway

