import { Role } from "@enums/Role";
import { axiosInstance } from "./axiosInstance";
import {
  CreateTestChoiceRequest,
  TestChoice,
  TestChoiceView,
} from "./testChoice";

const BASE_URL = "/testsessions";

export interface TestSession {
  id: number;
  userId: number;
  testTemplateId: number;
  startTime: string;
  endTime: string;
  choices: TestChoice[];
}

export interface TestSessionView {
  id: number;
  userEmail: string;
  userRole: Role;
  testName: string;
  testDescription: string;
  startTime: string;
  endTime: string;
  choices: TestChoiceView[];
}

export interface CreateTestSessionRequest {
  testTemplateId: number;
  startTime: string;
  endTime: string;
  choices: CreateTestChoiceRequest[];
}

export const getAllTestSessions = () =>
  axiosInstance.get<TestSession[]>(`${BASE_URL}`);

export const getAllTestSessionsFormatted = () =>
  axiosInstance.get<TestSessionView[]>(`${BASE_URL}/formatted`);

export const createNewTestSession = (request: CreateTestSessionRequest) =>
  axiosInstance.post<TestSession>(`${BASE_URL}/add`, request);
