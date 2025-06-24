import { axiosInstance } from "./axiosInstance";
import { TestSessionView } from "./testSession";

const BASE_URL = "/student-teacher-relation";

export interface StudentTeacherRelation {
  id: number;
  studentId: number;
  teacherId: number;
  testSessionId: number;
}

export const getSharedTestSessions = () =>
  axiosInstance.get<TestSessionView[]>(`${BASE_URL}/testSessions`);

export const addStudentTeacherRelation = () =>
  axiosInstance.post<StudentTeacherRelation>(`${BASE_URL}/add`, {});

export const deleteStudentTeacherRelation = (id: number) =>
  axiosInstance.delete(`${BASE_URL}${id}`);
