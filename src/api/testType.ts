import { axiosInstance } from "./axiosInstance";

const BASE_URL = "/test-type";

export interface TestType {
  id: string;
  name: string;
  description: string;
}

export interface CreateTestTypeDto {
  name: string;
  description: string;
}
