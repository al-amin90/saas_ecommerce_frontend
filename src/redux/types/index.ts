import { baseApi } from "../api/baseApi";

export interface IAuthState {
  accessToken: string | null;
  refreshToken?: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
  } | null;
  isLoading: boolean;
  error: string | null;
}

export type TReduxQuery = { url: string; data?: unknown; params: unknown };
