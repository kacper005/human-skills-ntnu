import axios from "axios";
import { axiosInstance } from "./axiosInstance";
import { Role } from "../enums/Role";
import { Gender } from "../enums/Gender";
import { AuthProvider } from "../enums/AuthProvider";

const BASE_URL = "/user";

export interface User {
  id: string;
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
  email?: string;
  password?: string;
  role?: string;
}

export const getUserMe = () => axiosInstance.get<User>(`${BASE_URL}/get-me`);

export const getUsers = () => axios.get<User[]>(BASE_URL);

export const getUserById = (id: string) => axios.get<User>(`${BASE_URL}/${id}`);

export const createUser = (data: CreateUserDto) =>
  axiosInstance.post<CreateUserDto>(`${BASE_URL}/add`, data);

export const updateUser = (id: string, data: UpdateUserDto) =>
  axios.put<User>(`${BASE_URL}/${id}`, data);

export const deleteUser = (id: string) => axios.delete(`${BASE_URL}/${id}`);

export const updateOwnProfile = (data: UpdateUserDto) =>
  axiosInstance.put<User>("/users/me", data);
