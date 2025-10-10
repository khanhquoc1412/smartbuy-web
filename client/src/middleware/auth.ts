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

    const requiresAuth = Boolean(from.meta.requiresAuth)
    const adminOnly = Boolean(from.meta.adminOnly)

    if (requiresAuth) {
        const access_token = localStorage.getItem(ACCESS_TOKEN_KEY);
        const userId = localStorage.getItem(USER_ID);
        if (access_token && userId) {
            try {
                const user = await getUserInfo(userId);

                if (!user) return next(`/login?redirect=${to.path}`)

                if (adminOnly) {
                    // accept both boolean and string flags
                    const isAdmin = (user as any).isAdmin === true || (user as any).isAdmin === 'true' || (user as any).role === 'admin'
                    if (!isAdmin) return next('/')
                }

                return next();
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