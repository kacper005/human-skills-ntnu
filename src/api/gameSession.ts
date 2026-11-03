import { axiosInstance } from "./axiosInstance";
import { GameType } from "@enums/GameType";

const BASE_URL = "/gamesessions";

// Game-specific result values, e.g. { points: 120, accuracy: 85 }
export type GameSessionScore = Record<string, unknown>;

export interface AddGameSessionRequest {
  gameTemplateId: number;
  startTime: string;
  endTime: string;
  score: GameSessionScore;
}

export interface GameSession {
  id: number;
  userId: number;
  gameTemplateId: number;
  gameType: GameType;
  gameName: string;
  startTime: string;
  endTime: string;
  score: GameSessionScore | null;
}

export const getAllGameSessionsForCurrentUser = () =>
  axiosInstance.get<GameSession[]>(BASE_URL);

export const addGameSession = (payload: AddGameSessionRequest) =>
  axiosInstance.post<string>(BASE_URL + "/add", payload);

export const getGameSessionById = (id: number) =>
  axiosInstance.get<GameSession>(BASE_URL + "/" + id);

export const deleteGameSession = (id: number) =>
  axiosInstance.delete<string>(BASE_URL + "/delete/" + id);
