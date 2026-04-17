import { AuthTokens } from "../outputs/auth-tokens";
import { UserInfo } from "../outputs/user-info";

export interface AuthProvider {
  login(email: string, password: string): Promise<AuthTokens>;
  refresh(refreshToken: string): Promise<AuthTokens>;
  revoke(refreshToken: string): Promise<void>;
  getUserInfo(accessToken: string): Promise<UserInfo>;
}

export const AUTH_PROVIDER = Symbol("AUTH_PROVIDER");
