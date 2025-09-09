import { $axios } from "@plugins/axios/axios";
import {
    IAthleteProfile,
    ILoginBody,
    ILoginResponse,
    IMeta,
    INewAccessToken,
    IPagination,
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
    }
});

export const { login, register, forgotPassword, getUserSuccess, getUser, getNewToken } = auth();