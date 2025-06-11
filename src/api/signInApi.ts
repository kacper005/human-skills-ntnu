import { AuthProvider } from "../enums/AuthProvider";
import { axiosInstance } from "./axiosInstance";

const BASE_URL = "/authenticate";

export interface LoginDto {
  email: string;
  password: string;
  authProvider: AuthProvider;
}

export const signIn = (data: LoginDto) =>
  axiosInstance.post<LoginDto>(BASE_URL, data);
