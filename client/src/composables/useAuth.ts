import { loginMutation, registerMutation, forgotPasswordMutation, loginUserSuccessMutation } from "@/api/auth/query";
import useAuthStore from "@/store/auth";
import { ACCESS_TOKEN_KEY, USER_ID, REFRESH_TOKEN_KEY } from "@/utils/constants";
import { storeToRefs } from "pinia";
import { useStorage } from "@vueuse/core";
import { ILoginBody, IRegisterBody } from "@/types/auth.types";


export const useAuth = () => {
    const router = useRouter();
    const { start, finish } = useLoading();
    const { getUserInfo, updateUser } = useAuthStore();
    const { loggedIn, userInfo: user } = storeToRefs(useAuthStore());
    const accessToken = useStorage(ACCESS_TOKEN_KEY, "");
    const refreshToken = useStorage(REFRESH_TOKEN_KEY, "");
    const userId = useStorage(USER_ID, "");
    const {
        data: loginData,
        isLoading: isSignInLoading,
        error: signInError,
        mutateAsync: loginMutateAsync,

    } = loginMutation();

    const signIn = async ({ email, password }: ILoginBody) => {
        start();
        try {
            await loginMutateAsync({
                email,
                password
            });
            if (loginData && loginData.value) {
                accessToken.value = loginData.value?.accessToken;
                refreshToken.value = loginData.value.refreshToken
                userId.value = String(loginData.value?.user.id);
                loggedIn.value = true
                user.value = loginData.value?.user
                router.push("/");
            }
        } finally {
            finish();
        }
    };


    const {
        data: loginUserSucessData,
        isLoading: isSignInUserSucessLoading,
        error: signInUserSucessError,
        mutateAsync: loginUserSucessMutateAsync,

    } = loginUserSuccessMutation();

    //login gg & fb
    const signInUserSuccess = async (id: string | number) => {
        try {
            await loginUserSucessMutateAsync(
                id
            );
            if (loginUserSucessData && loginUserSucessData.value) {
                accessToken.value = loginUserSucessData.value?.accessToken;
                refreshToken.value = loginUserSucessData.value.refreshToken
                userId.value = String(loginUserSucessData.value?.user.id);
                loggedIn.value = true
                user.value = loginUserSucessData.value?.user
                router.push("/");
            }

        } finally {
            finish();
        }
    }

    const {
        data: registerData,
        isLoading: isRegisterLoading,
        error: registerError,
        mutateAsync: registerMutateAsync,
    } = registerMutation();
    const register = async ({ userName, email, password, confirmPassword }: IRegisterBody) => {
        start();
        try {
            await registerMutateAsync({
                userName,
                email,
                password,
                confirmPassword
            });

        } finally {
            finish();
        }
    }

  const signOut = () => {
    accessToken.value = null;
    userId.value = null;
    router.push("/login");
    window.location.reload();
};


    const {
        data: forgotPasswordData,
        isLoading: isForgotPasswordLoading,
        error: forgotPasswordError,
        mutateAsync: forgotPasswordMutateAsync,
    } = forgotPasswordMutation();

    const forgotPassword = async (email: string) => {
        start()
        try {
            await forgotPasswordMutateAsync(email)
        } finally {
            finish()
        }
    }
    return {
        loggedIn,
        user,
        isSignInLoading,
        signInError,
        getUserInfo,
        signIn,
        signOut,
        updateUser,
        register,
        registerData,
        registerError,
        isRegisterLoading,
        userId,
        forgotPassword,
        forgotPasswordData,
        forgotPasswordError,
        loginUserSucessData,
        isSignInUserSucessLoading,
        signInUserSucessError,
        signInUserSuccess
    };
};