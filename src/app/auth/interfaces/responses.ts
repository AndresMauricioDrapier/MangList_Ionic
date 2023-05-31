import { Auth } from "./auth";

export interface AuthResponse {
  result: Auth;
}

export interface AuthResponses {
  result: Auth[];
}

export interface TokenResponse {
  data: {
    token: string;
    id: string;
  },
  error: string;
}
