import { axiosInstance } from "./axiosInstance";
import { Campus } from "../enums/Campus";
import { StudyLevel } from "../enums/StudyLevel";

const BASE_URL = "/study-program";

export interface StudyProgram {
  id: string;
  name: string;
  campus: Campus;
  studyLevel: StudyLevel;
}

export interface CreateStudyProgramDto {
  name: string;
  campus: Campus;
  studyLevel: StudyLevel;
}

export interface UpdateStudyProgramDto {
  name?: string;
  campus?: Campus;
  studyLevel?: StudyLevel;
}

export const getStudyPrograms = () =>
  axiosInstance.get<StudyProgram[]>(BASE_URL);

export const addStudyProgram = (data: CreateStudyProgramDto) =>
  axiosInstance.post<StudyProgram>(`${BASE_URL}/add`, data);

export const updateStudyProgram = (id: string, data: UpdateStudyProgramDto) =>
  axiosInstance.put<StudyProgram>(`${BASE_URL}/update/${id}`, data);

export const deleteStudyProgram = (id: string) =>
  axiosInstance.delete(`${BASE_URL}/delete/${id}`);
