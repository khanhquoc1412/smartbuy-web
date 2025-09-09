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

const address = () => ({
    login(body: ILoginBody) {
        return $axios.post<ILoginResponse, ILoginResponse>("/auth/login", body);
    },

    register(body: IRegisterBody) {
        return $axios.post("/auth/register", body);
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
});

export const { login, register, getUser, getNewToken } = address();