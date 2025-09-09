import { defineStore } from "pinia";
import state from "./state";
import { getUser } from "@/api/auth/auth";
import { IUser } from "@/types/user.types";
import { ACCESS_TOKEN_KEY } from "@/utils/constants";

const useAuthStore = defineStore({
    id: "auth",
    state: () => ({
        userInfo: {} as IUser,
        loggedIn: !!localStorage.getItem(ACCESS_TOKEN_KEY)
    }),
    actions: {
        async getUserInfo(userId: string | number) {
            try {
                const user = await getUser(userId);

                if (user) {
                    this.userInfo = user;
                    return Promise.resolve(user);
                }
            } catch (error) {
                return Promise.reject(error);
            }
        },
        updateUser(user: IUser) {
            this.userInfo = user;
        },
    },
});

export default useAuthStore;