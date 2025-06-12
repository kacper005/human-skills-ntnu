import { axiosInstance } from "./axiosInstance";

const BASE_URL = "/student-profile";

export interface StudentProfile {
  id: string;
  studyProgramId: number;
  yearsOfStudy: number;
}

export interface CreateStudentProfileDto {
  studyProgramId: number;
  yearsOfStudy: number;
}

export interface UpdateStudentProfileDto {
  studyProgramId?: number;
  yearsOfStudy?: number;
}

export const getStudentProfile = () =>
  axiosInstance.get<StudentProfile>(BASE_URL);

export const createStudentProfile = (data: CreateStudentProfileDto) =>
  axiosInstance.post<StudentProfile>(`${BASE_URL}/add`, data);

export const updateStudentProfile = (data: UpdateStudentProfileDto) =>
  axiosInstance.put<StudentProfile>(`${BASE_URL}/update`, data);
