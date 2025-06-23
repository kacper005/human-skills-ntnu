import { axiosInstance } from "./axiosInstance";

const BASE_URL = "/tudent-teacher-relation";

export interface StudentTeacherRelation {
  id: number;
  studentId: number;
  teacherId: number;
  testSessionId: number;
}

export const getStudentTeacherRelations = () =>
  axiosInstance.get<StudentTeacherRelation[]>(`${BASE_URL}`);

export const addStudentTeacherRelation = () =>
  axiosInstance.post<StudentTeacherRelation>(`${BASE_URL}/add`, {});

export const deleteStudentTeacherRelation = (id: number) =>
  axiosInstance.delete(`${BASE_URL}${id}`);
