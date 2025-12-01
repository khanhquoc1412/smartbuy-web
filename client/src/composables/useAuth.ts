import { loginMutation, registerMutation, forgotPasswordMutation, loginUserSuccessMutation, useUpdateProfileMutation, verifyForgotPasswordOTPMutation, resetPasswordMutation, verifyChangeEmailOTPMutation } from "@/api/auth/query";
import useAuthStore from "@/store/auth";
import { ACCESS_TOKEN_KEY, USER_ID, REFRESH_TOKEN_KEY } from "@/utils/constants";
import { storeToRefs } from "pinia";
import useLoading from "./useLoading";
import { ILoginBody, IRegisterBody } from "@/types/auth.types";
import { useStorage } from "@vueuse/core";
import { IUser } from "@/types/user.types";
import { useRouter } from "vue-router";

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

    } = loginMutation() as any;

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

    } = loginUserSuccessMutation() as any;

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
    } = registerMutation() as any;
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
        refreshToken.value = null;
        userId.value = null;
        loggedIn.value = false;
        user.value = {} as IUser;
        localStorage.clear();
        router.push("/login");
        window.location.reload();
    };


    const {
        data: forgotPasswordData,
        isLoading: isForgotPasswordLoading,
        error: forgotPasswordError,
        mutateAsync: forgotPasswordMutateAsync,
    } = forgotPasswordMutation() as any;

    const forgotPassword = async (email: string) => {
        start()
        try {
            await forgotPasswordMutateAsync(email)
        } finally {
            finish()
        }
    }

    const {
        data: verifyOTPData,
        isLoading: isVerifyOTPLoading,
        error: verifyOTPError,
        mutateAsync: verifyOTPMutateAsync,
    } = verifyForgotPasswordOTPMutation() as any;

    const verifyForgotPasswordOTP = async (email: string, otp: string) => {
        start();
        try {
            await verifyOTPMutateAsync({ email, otp });
        } finally {
            finish();
        }
    };

    const {
        data: resetPasswordData,
        isLoading: isResetPasswordLoading,
        error: resetPasswordError,
        mutateAsync: resetPasswordMutateAsync,
    } = resetPasswordMutation() as any;

    const resetPassword = async (userId: string, token: string, data: any) => {
        start();
        try {
            await resetPasswordMutateAsync({ userId, token, data });
        } finally {
            finish();
        }
    };

    const getUserProfile = async () => {
        if (userId.value) {
            return await getUserInfo(userId.value);
        }
    };

    const { mutate: updateProfile } = useUpdateProfileMutation();

    const {
        data: verifyChangeEmailData,
        isLoading: isVerifyChangeEmailLoading,
        error: verifyChangeEmailError,
        mutateAsync: verifyChangeEmailMutateAsync,
    } = verifyChangeEmailOTPMutation() as any;

    const verifyChangeEmailOTP = async (otp: string) => {
        start();
        try {
            await verifyChangeEmailMutateAsync(otp);
        } finally {
            finish();
        }
    };

    return {
        loggedIn,
        user,
        isSignInLoading,
        signInError,
        getUserInfo,
        getUserProfile,
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
        signInUserSuccess,
        updateProfile,
        verifyForgotPasswordOTP,
        verifyOTPData,
        isVerifyOTPLoading,
        verifyOTPError,
        resetPassword,
        resetPasswordData,
        isResetPasswordLoading,
        resetPasswordError,
        isForgotPasswordLoading,
        verifyChangeEmailOTP,
        verifyChangeEmailData,
        isVerifyChangeEmailLoading,
        verifyChangeEmailError
    };
};