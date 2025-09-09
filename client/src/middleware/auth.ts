import useAuthStore from "@store/auth";
import { storeToRefs } from "pinia";
import { RouteLocationNormalized, NavigationGuardNext } from "vue-router";
import { ACCESS_TOKEN_KEY, USER_ID } from "@/utils/constants";
import useStore from "@/store";

export const auth = async (
    from: RouteLocationNormalized,
    to: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const { getUserInfo } = useAuthStore();

    if (from.meta.requiresAuth) {
        const access_token = localStorage.getItem(ACCESS_TOKEN_KEY);
        const userId = localStorage.getItem(USER_ID);
        if (access_token && userId) {
            try {
                const user = await getUserInfo(userId);

                if (user) {
                    next();
                }
            } catch (error) {
                localStorage.removeItem(ACCESS_TOKEN_KEY);
                console.log("Lỗi get")
                next(`/login?redirect=${to.path}`);
            }
        } else {
            console.log("Lỗi else", to)
            next(`/login?redirect=${to.path}`);
        }
    } else {
        next();
    }
};