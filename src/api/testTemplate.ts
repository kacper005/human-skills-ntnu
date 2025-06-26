import { TestType } from "@enums/TestType";
import { axiosInstance } from "./axiosInstance";
import { TestQuestion } from "./testQuestion";
import { TestOptionType } from "@enums/TestOptionType";

const BASE_URL = "/test";

export interface TestTemplate {
  id: number;
  name: string;
  description: string;
  testType: TestType;
  optionType: TestOptionType;
  questions: TestQuestion[];
}

export interface UpdateTestTemplateDto {
  description: string;
}

export const getAllTestTemplates = () =>
  axiosInstance.get<TestTemplate[]>(`${BASE_URL}/get-all`);

export const getTestTemplateById = (id: number) =>
  axiosInstance.get<TestTemplate>(`${BASE_URL}/get/${id}`);

export const getTestTemplatesByType = (testType: TestType) =>
  axiosInstance.get<TestTemplate>(`${BASE_URL}/get-by-test-type/${testType}`);

export const updateTestTemplateDescription = (
  id: number,
  description: string
) => {
  return axiosInstance.put(
    `${BASE_URL}/update-description/${id}`,
    description,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
};
