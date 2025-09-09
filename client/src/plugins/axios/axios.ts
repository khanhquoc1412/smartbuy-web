import axios, { AxiosInstance } from "axios";
import interceptors from "./interceptors";


const axiosInstance: AxiosInstance = axios.create({
    baseURL: "http://localhost:3000/api/",
    timeout: 3000,
});
export const _axios: AxiosInstance = axios.create({
    timeout: 3000,
});


interceptors(axiosInstance)

export const $axios = axiosInstance;