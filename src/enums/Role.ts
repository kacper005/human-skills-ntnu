export enum Role {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}

export const getRoleDisplayName = (role: Role): string => {
  switch (role) {
    case Role.ADMIN:
      return "Administrator";
    case Role.TEACHER:
      return "Teacher";
    case Role.STUDENT:
      return "Student";
    default:
      return "Unknown Role";
  }
};
