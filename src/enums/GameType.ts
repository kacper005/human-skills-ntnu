export enum GameType {
  ATTENTION = "ATTENTION",
  BALLOON = "BALLOON",
  COGFLEX = "COGFLEX",
}

export const getGameTypeDisplayName = (type: GameType): string => {
  switch (type) {
    case GameType.ATTENTION:
      return "Attention";
    case GameType.BALLOON:
      return "Balloon";
    case GameType.COGFLEX:
      return "CogFlex";
    default:
      return "Unknown Game Type";
  }
};
