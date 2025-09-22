import axios, { AxiosInstance } from "axios";
import interceptors from "./interceptors";







const axiosInstance: AxiosInstance = axios.create({
    baseURL: "http://localhost:3005/api/",
    timeout: 10000,
});
export const _axios: AxiosInstance = axios.create({
    timeout: 3000,
});


interceptors(axiosInstance)

export const $axios = axiosInstance;