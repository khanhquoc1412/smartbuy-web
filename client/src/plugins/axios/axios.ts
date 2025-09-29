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

// --- Category Service ---
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
