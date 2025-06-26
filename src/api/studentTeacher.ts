import { axiosInstance } from "./axiosInstance";
import { TestSessionView } from "./testSession";

const BASE_URL = "/student-teacher-relation";

export interface StudentTeacherRelation {
  id: number;
  studentId: number;
  teacherId: number;
  teacherEmail: string;
  testSessionId: number;
}

export interface TeacherRelationReply {
  relationId: number;
  teacherEmail: string;
  teacherName: string;
}

export interface CreateStudentTeacherRelation {
  teacherId: number;
  testSessionId: number;
}

export const getSharedTestSessions = () =>
  axiosInstance.get<TestSessionView[]>(`${BASE_URL}/testSessions`);

export const getSharedTestSessionsById = (id: number) =>
  axiosInstance.get<TestSessionView>(`${BASE_URL}/testSession/${id}`);

export const getStudentTeacherRelationsBySessionId = (id: number) =>
  axiosInstance.get<TeacherRelationReply[]>(`${BASE_URL}/teachers/${id}`);

export const addStudentTeacherRelation = (data: CreateStudentTeacherRelation) =>
  axiosInstance.post<StudentTeacherRelation>(`${BASE_URL}/add`, data);

export const deleteStudentTeacherRelation = (id: number) =>
  axiosInstance.delete(`${BASE_URL}/${id}`);
