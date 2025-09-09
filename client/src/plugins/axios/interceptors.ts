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
      const access_token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (access_token && config.headers) {
        config.headers["authorization"] = `Bearer ${access_token}`;
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
      const originalConfig = error.config;

      if (error.response) {
        if (error.response.status === 401) {
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
            // redirectLogin
            return Promise.reject(error);
          }
        }

        return Promise.reject(error.response.data);
      }
      return Promise.reject(error);

    }
  );
}

