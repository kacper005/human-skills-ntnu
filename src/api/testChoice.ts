export interface TestChoice {
  id: number;
  questionId: number;
  selectedOptionId: number;
}

export interface CreateTestChoiceRequest {
  questionId: number;
  selectedOptionId: number;
}
