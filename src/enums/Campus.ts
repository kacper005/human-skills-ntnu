export enum Campus {
  GJOVIK = "GJOVIK",
  AALESUND = "AALESUND",
  TRONDHEIM = "TRONDHEIM",
}

export const getCampusDisplayName = (campus: Campus): string => {
  switch (campus) {
    case Campus.GJOVIK:
      return "Gjøvik";
    case Campus.AALESUND:
      return "Ålesund";
    case Campus.TRONDHEIM:
      return "Trondheim";
    default:
      return "Unknown Campus";
  }
};
