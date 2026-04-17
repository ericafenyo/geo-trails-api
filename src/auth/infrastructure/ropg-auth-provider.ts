import { AuthProvider } from "../application/interfaces/auth-provider.interface";
import { AuthTokens } from "../application/outputs/auth-tokens";
import { UserInfo } from "../application/outputs/user-info";
import { RopgClient } from "./ropg-client";

export class RopgAuthProvider implements AuthProvider {
  constructor(private readonly client: RopgClient) {}

  async login(email: string, password: string): Promise<AuthTokens> {
    const response = await this.client.requestTokens(email, password);
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      idToken: response.id_token,
    };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const response = await this.client.refreshTokens(refreshToken);
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      idToken: response.id_token,
    };
  }

  async revoke(refreshToken: string): Promise<void> {
    await this.client.revokeToken(refreshToken);
  }

  async getUserInfo(accessToken: string): Promise<UserInfo> {
    const response = await this.client.fetchUserInfo(accessToken);
    return {
      id: response.sub,
      email: response.email,
      nickname: response.nickname,
      firstName: response.given_name,
      lastName: response.family_name,
    };
  }
}
