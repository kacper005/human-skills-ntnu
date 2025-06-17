import { TestOptionType } from "@/enums/TestOptionType";

export interface TestOption {
  id: number;
  testOptionType: TestOptionType;
  optionText: string;
  agreementLevel: number;
}
