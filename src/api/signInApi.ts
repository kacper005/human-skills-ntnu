import { axiosInstance } from "./axiosInstance";
import { AuthProvider } from "@enums/AuthProvider";

const BASE_URL = "/authenticate";

export interface LoginDto {
  email: string;
  password: string;
  authProvider: AuthProvider;
}

export const signIn = (data: LoginDto) =>
  axiosInstance.post<LoginDto>(BASE_URL, data);
