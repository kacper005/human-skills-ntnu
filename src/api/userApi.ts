import { axiosInstance } from "./axiosInstance";
import { Role } from "@enums/Role";
import { Gender } from "@enums/Gender";
import { AuthProvider } from "@enums/AuthProvider";

const BASE_URL = "/user";

export interface User {
  id: number;
  credentialId: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl: string;
  role: Role;
  gender: Gender;
  createdAt: string;
}

export interface CreateUserDto {
  authProvider: AuthProvider;
  idToken?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  gender: Gender;
  role?: Role;
}

export interface UpdateUserMeDto {
  firstName?: string;
  lastName?: string;
  gender?: Gender | "";
}

export interface UpdateUserDto {
  id: number;
  role: Role;
}

export const getUserMe = () => axiosInstance.get<User>(`${BASE_URL}/get-me`);

export const updateUserMe = (data: UpdateUserMeDto) =>
  axiosInstance.put<User>(`${BASE_URL}/update-me`, data);

export const deleteUserMe = () => axiosInstance.delete(`${BASE_URL}/delete-me`);

export const getUsers = () => axiosInstance.get<User[]>(`${BASE_URL}/get-all`);

export const getUserById = (id: string) =>
  axiosInstance.get<User>(`${BASE_URL}/${id}`);

export const createUser = (data: CreateUserDto) =>
  axiosInstance.post<CreateUserDto>(`${BASE_URL}/add`, data);

export const updateUserRole = (id: number, role: Role) =>
  axiosInstance.put<string>(`${BASE_URL}/update-role/${id}`, role);
