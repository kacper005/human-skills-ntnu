import { axiosInstance } from "./axiosInstance";

const BASE_URL = "/gamesessions";

export interface AddGameSessionRequest {
  gameTemplateId: number;
  startTime: string;
  endTime: string;
  score?: number;
  accuracy?: number;
  metadata?: Record<string, unknown>;
}

export interface GameSession {
  id: number;
  userId?: number;
  gameTemplateId?: number;
  startTime?: string;
  endTime?: string;
  score?: number;
  accuracy?: number;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

export interface GameSessionReply {
  id: number;
  userId: number;
  gameTemplateId: number;
  gameType?: string;
  gameName?: string;
  startTime: string;
  endTime: string;
  score?: number;
  accuracy?: number;
  metadata?: Record<string, unknown>;
}

export const getAllGameSessionsForCurrentUser = () =>
  axiosInstance.get<GameSession[]>(BASE_URL);

export const addGameSession = (payload: AddGameSessionRequest) =>
  axiosInstance.post<string>(BASE_URL + "/add", payload);

export const getGameSessionById = (id: number) =>
  axiosInstance.get<GameSessionReply>(BASE_URL + "/" + id);

export const deleteGameSession = (id: number) =>
  axiosInstance.delete<string>(BASE_URL + "/delete/" + id);