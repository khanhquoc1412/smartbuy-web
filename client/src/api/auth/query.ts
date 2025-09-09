import { UseQueryOptions, useMutation, useQuery } from "vue-query";
import { getUser, login, getUserSuccess, register, forgotPassword } from "./auth";
import { ILoginBody, IRegisterBody } from "@/types/auth.types";

export const loginMutation = (options?: UseQueryOptions) => {
  return useMutation({
    mutationFn: (body: ILoginBody) => login(body),
  });
};
export const loginUserSuccessMutation = (options?: UseQueryOptions) => {
  return useMutation({
    mutationFn: (userId: string | number) => getUserSuccess(userId),
  });
};
export const registerMutation = (options?: UseQueryOptions) => {
  return useMutation({
    mutationFn: (body: IRegisterBody) => register(body),
  });
};
export const forgotPasswordMutation = (options?: UseQueryOptions) => {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
};

