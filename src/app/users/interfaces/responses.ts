import { User } from "./user";

export interface UserResponse {
  user: User;
}

export interface UsersResponse {
  users: User[];
}

export interface TokenResponse {
  accessToken: string;
}
