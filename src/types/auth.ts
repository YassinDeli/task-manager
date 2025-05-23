import { User } from "./user-management";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface ConnectPayload {
  usernameOrEmail: string;
  password: string;
}

export interface ConnectResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
