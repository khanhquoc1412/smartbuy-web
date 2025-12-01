import { useMutation } from "@tanstack/vue-query";
import { login, getUserSuccess, register, forgotPassword, uploadAvatar, updateProfile, verifyForgotPasswordOTP, resetPassword, verifyChangeEmailOTP } from "./auth";
import { ILoginBody, IRegisterBody } from "@/types/auth.types";

// ✅ Login Mutation
export const loginMutation = () => {
  return useMutation({
    mutationFn: (body: ILoginBody) => {
      console.log('🔵 [Mutation] loginMutation called');
      console.log('  Body:', body);
      return login(body);
    },
  });
};

// ✅ Login User Success Mutation
export const loginUserSuccessMutation = () => {
  return useMutation({
    mutationFn: (userId: string | number) => {
      console.log('🔵 [Mutation] loginUserSuccessMutation called');
      console.log('  UserId:', userId);
      return getUserSuccess(userId);
    },
  });
};

// ✅ Register Mutation
export const registerMutation = () => {
  return useMutation({
    mutationFn: (body: IRegisterBody) => {
      console.log('🔵 [Mutation] registerMutation called');
      console.log('  Body:', body);
      return register(body);
    },
  });
};

// ✅ Forgot Password Mutation
export const forgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (email: string) => {
      console.log('🔵 [Mutation] forgotPasswordMutation called');
      console.log('  Email:', email);
      return forgotPassword(email);
    },
  });
};

// ✅ Upload Avatar Mutation
export const useUploadAvatarMutation = () => {
  return useMutation({
    mutationFn: (formData: FormData) => {
      return uploadAvatar(formData);
    }
  });
}


// ✅ Update Profile Mutation
export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: (body: any) => {
      return updateProfile(body);
    }
  });
};

// ✅ Verify Forgot Password OTP Mutation
export const verifyForgotPasswordOTPMutation = () => {
  return useMutation({
    mutationFn: (body: { email: string; otp: string }) => {
      return verifyForgotPasswordOTP(body.email, body.otp);
    },
  });
};

// ✅ Reset Password Mutation
export const resetPasswordMutation = () => {
  return useMutation({
    mutationFn: (body: { userId: string; token: string; data: any }) => {
      return resetPassword(body.userId, body.token, body.data);
    },
  });
};

// ✅ Verify Change Email OTP Mutation
export const verifyChangeEmailOTPMutation = () => {
  return useMutation({
    mutationFn: (otp: string) => {
      return verifyChangeEmailOTP(otp);
    },
  });
};