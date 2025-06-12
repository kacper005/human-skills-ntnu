export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNIDENTIFIED = "UNIDENTIFIED",
}

export const getGenderDisplayName = (gender: Gender) => {
  switch (gender) {
    case Gender.MALE:
      return "Male";
    case Gender.FEMALE:
      return "Female";
    case Gender.UNIDENTIFIED:
      return "Unidentified";
    default:
      return gender;
  }
};
