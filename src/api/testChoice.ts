export interface TestChoice {
  id: number;
  questionId: number;
  selectedOptionId: number;
}

export interface TestChoiceView {
  question: string;
  answer: string;
}

export interface CreateTestChoiceRequest {
  questionId: number;
  selectedOptionId: number;
}
