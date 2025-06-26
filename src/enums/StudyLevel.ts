export enum StudyLevel {
  MASTER = "MASTER",
  BACHELOR = "BACHELOR",
  PHD = "PHD",
}

export const getStudyLevelDisplayName = (level: StudyLevel): string => {
  switch (level) {
    case StudyLevel.MASTER:
      return "Master's Degree";
    case StudyLevel.BACHELOR:
      return "Bachelor's Degree";
    case StudyLevel.PHD:
      return "PhD";
    default:
      return "Unknown Level";
  }
};
