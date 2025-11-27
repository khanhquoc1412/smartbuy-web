import { $axios } from "@plugins/axios/axios";
import {
    ILoginBody,
    ILoginResponse,
    INewAccessToken,
    IRegisterBody,
} from "@/types/auth.types";
import { IUser } from "@/types/user.types";

const auth = () => ({
    login(body: ILoginBody) {
        return $axios.post<ILoginResponse, ILoginResponse>("/auth/login", body);
    },
    register(body: IRegisterBody) {
        return $axios.post("/auth/register", body);
    },
    forgotPassword(email: string) {
        return $axios.post("/auth/forgot-password", { email });
    },
    getUser(userId: string | number) {
        return $axios.get<unknown, IUser>(`/auth/profile/${userId}`);
    },
    getNewToken(refreshToken: string, userId: string | number) {
        return $axios.post<unknown, INewAccessToken>(`/auth/refresh-token`, {
            refreshToken,
            userId
        });
    },
    getUserSuccess(userId: string | number) {
        return $axios.post<unknown, ILoginResponse>("/auth/login-success", { userId });
    },
    uploadAvatar(formData: FormData) {
        return $axios.post<{ success: boolean, avatarUrl: string }>("/auth/upload-avatar", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
});

export const { login, register, forgotPassword, getUserSuccess, getUser, getNewToken, uploadAvatar } = auth();