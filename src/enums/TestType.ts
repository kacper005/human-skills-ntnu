export enum TestType {
  BIG_5 = "BIG_5",
  INTELLIGENCE_FLUID = "INTELLIGENCE_FLUID",
}

export const getTestTypeDisplayName = (type: TestType): string => {
  switch (type) {
    case TestType.BIG_5:
      return "Big Five Personality Test";
    case TestType.INTELLIGENCE_FLUID:
      return "Fluid Intelligence Test";
    default:
      return "Unknown Test Type";
  }
};
