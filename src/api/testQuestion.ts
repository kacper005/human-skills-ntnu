import { TestOption } from "./testOption";

export interface TestQuestion {
  id: number;
  questionText: string;
  options: TestOption[];
  correctOptions?: TestOption[];
}
