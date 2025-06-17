import { axiosInstance } from "./axiosInstance";
import { CreateTestChoiceRequest, TestChoice } from "./testChoice";

const BASE_URL = "/testsessions";

export interface TestSession {
  id: number;
  userId: number;
  testTemplateId: number;
  startTime: string;
  endTime: string;
  choices: TestChoice[];
}

export interface CreateTestSessionRequest {
  testTemplateId: number;
  startTime: string;
  endTime: string;
  choices: CreateTestChoiceRequest[];
}

export const getAllTestSessions = () =>
  axiosInstance.get<TestSession[]>(`${BASE_URL}`);

export const createNewTestSession = (request: CreateTestSessionRequest) =>
  axiosInstance.post<TestSession>(`${BASE_URL}/add`, request);
