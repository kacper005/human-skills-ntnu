export enum TestOptionType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  LIKERT_SCALE = "LIKERT_SCALE",
}

export const getTestOptionTypeDisplayName = (type: TestOptionType): string => {
  switch (type) {
    case TestOptionType.MULTIPLE_CHOICE:
      return "Multiple Choice";
    case TestOptionType.LIKERT_SCALE:
      return "Likert Scale";
    default:
      return "Unknown Option Type";
  }
};
