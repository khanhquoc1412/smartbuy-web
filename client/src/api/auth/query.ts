import { useMutation } from "@tanstack/vue-query";  // ✅ FIX: Đổi import
import { login, getUserSuccess, register, forgotPassword } from "./auth";
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