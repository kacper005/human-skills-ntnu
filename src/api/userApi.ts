import { axiosInstance } from "./axiosInstance";
import { Role } from "../enums/Role";
import { Gender } from "../enums/Gender";
import { AuthProvider } from "../enums/AuthProvider";

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

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  gender?: Gender | "";
}

export const getUserMe = () => axiosInstance.get<User>(`${BASE_URL}/get-me`);

export const updateUserMe = (data: UpdateUserDto) =>
  axiosInstance.put<User>(`${BASE_URL}/update-me`, data);

export const deleteUserMe = () => axiosInstance.delete(`${BASE_URL}/delete-me`);

export const getUsers = () => axiosInstance.get<User[]>(`${BASE_URL}/get-all`);

export const getUserById = (id: string) =>
  axiosInstance.get<User>(`${BASE_URL}/${id}`);

export const createUser = (data: CreateUserDto) =>
  axiosInstance.post<CreateUserDto>(`${BASE_URL}/add`, data);

export const updateUser = (id: string, data: UpdateUserDto) =>
  axiosInstance.put<User>(`${BASE_URL}/${id}`, data);

export const deleteUser = (id: string) =>
  axiosInstance.delete(`${BASE_URL}/${id}`);
