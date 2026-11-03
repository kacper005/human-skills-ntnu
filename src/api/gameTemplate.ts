import { axiosInstance } from './axiosInstance';
import { GameType } from "@enums/GameType";

const BASE_URL = '/game';

export interface GameTemplate {
  id: number;
  gameType: GameType;
  name: string;
  description: string | null;
  active: boolean;
}

export interface CreateGameTemplateRequest {
  gameType: GameType;
  name?: string;
  description?: string;
  active?: boolean;
}

export const getAllGameTemplates = () => 
  axiosInstance.get<GameTemplate[]>(BASE_URL + "/get-all");

export const getAllActiveGameTemplates = () =>
  axiosInstance.get<GameTemplate[]>(BASE_URL + "/get-all-active");

export const getGameTemplateById = (id: number) =>
  axiosInstance.get<GameTemplate>(BASE_URL + `/get/${id}`);

export const getGameTemplateByType = (gameType: GameType) =>
  axiosInstance.get<GameTemplate>(BASE_URL + `/get-by-game-type/${gameType}`);

export const addGameTemplate = (payload: CreateGameTemplateRequest) =>
  axiosInstance.post<number>(BASE_URL + "/add", payload);

export const updateGameTemplateDescription = (id: number, description: string) =>
  axiosInstance.put<string>(BASE_URL + "/update-description/" + id, description, {
    headers: { "Content-Type": "text/plain" },
  });

export const setGameTemplateActive = (id: number, active: boolean) =>
  axiosInstance.put<string>(BASE_URL + "/set-active/" + id, null, {
    params: { active },
  });