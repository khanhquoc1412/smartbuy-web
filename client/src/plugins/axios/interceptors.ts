import {
  AxiosResponse,
  AxiosStatic,
  AxiosError,
  AxiosRequestConfig,
  AxiosInstance,
} from "axios";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ID } from "@/utils/constants";
import { getNewToken } from "@api/auth/auth"
import { useStorage } from "@vueuse/core";
interface AxiosOriginalRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}


export default function interceptors(axios: AxiosInstance) {

  axios.interceptors.request.use(
    (config) => {
      console.log('🌐 AXIOS REQUEST INTERCEPTOR:');
      console.log('  Method:', config.method?.toUpperCase());
      console.log('  URL:', config.url);
      console.log('  Headers:', config.headers);
      console.log('  Data (BEFORE):', config.data); // ✅ DEBUG
      console.log('  Data type:', typeof config.data);
      
      const access_token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (access_token && config.headers) {
        config.headers["authorization"] = `Bearer ${access_token}`;
      }

      // 🔥 Nếu là FormData, xóa Content-Type để browser tự set với boundary
      if (config.data instanceof FormData) {
        console.log('🔥 Detected FormData - deleting Content-Type header');
        console.log('Before:', config.headers['Content-Type']);
        delete config.headers['Content-Type'];
        console.log('After:', config.headers['Content-Type']);
      } else {
        console.log('📦 Not FormData, keeping Content-Type:', config.headers['Content-Type']);
      }

      return config;
    },

    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    async (error: AxiosError) => {
      const originalConfig = error.config as AxiosOriginalRequestConfig;

      if (error.response) {
        // ✅ Kiểm tra user bị block (403 Forbidden)
        if (error.response.status === 403) {
          const responseData = error.response.data as any;
          
          if (responseData?.blocked === true) {
            // ✅ User bị khóa -> Force logout
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem(USER_ID);
            
            // Hiển thị thông báo
            alert(responseData.message || 'Tài khoản của bạn đã bị khóa');
            
            // Redirect về trang login
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            
            return Promise.reject(error);
          }
        }

        if (error.response.status === 401 && !originalConfig?._retry) {
          originalConfig._retry = true; // 🔥 Đánh dấu đã retry để tránh loop vô tận
          
          const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
          const userId = localStorage.getItem(USER_ID);
          
          try {
            const res = await getNewToken(refreshToken as string, userId as string)
            const newAccessToken = res.accessToken
            
            if (originalConfig?.headers) {
              localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken)
              originalConfig.headers["authorization"] = `Bearer ${newAccessToken}`;
            }
            
            if (originalConfig) {
              return axios(originalConfig)
            }
          } catch (error) {
            // ❌ Refresh token thất bại -> Đăng xuất người dùng
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem(USER_ID);
            
            // Redirect về trang login
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            
            return Promise.reject(error);
          }
        }

        return Promise.reject(error.response.data);
      }
      return Promise.reject(error);

    }
  );
}

