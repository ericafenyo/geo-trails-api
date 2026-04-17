import { UnauthorizedException } from "@nestjs/common";

export interface RopgTokenResponse {
  access_token: string;
  refresh_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

export interface RopgUserInfoResponse {
  sub: string;
  email: string;
  nickname: string;
  given_name: string;
  family_name: string;
}

export class RopgClient {
  private readonly tokenUrl: string;
  private readonly userInfoUrl: string;
  private readonly revokeUrl: string;

  constructor(
    private readonly domain: string,
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly audience: string,
  ) {
    this.tokenUrl = `https://${domain}/oauth/token`;
    this.userInfoUrl = `https://${domain}/userinfo`;
    this.revokeUrl = `https://${domain}/oauth/revoke`;
  }

  async requestTokens(email: string, password: string): Promise<RopgTokenResponse> {
    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "password",
        username: email,
        password,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        audience: this.audience,
        scope: "openid profile email offline_access",
      }),
    });

    if (!response.ok) {
      let message = "Token request failed";
      try {
        const error = await response.json();
        message = error.error_description ?? message;
      } catch {}
      throw new UnauthorizedException(message);
    }

    return response.json();
  }

  async refreshTokens(refreshToken: string): Promise<RopgTokenResponse> {
    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      let message = "Token refresh failed";
      try {
        const error = await response.json();
        message = error.error_description ?? message;
      } catch {}
      throw new UnauthorizedException(message);
    }

    return response.json();
  }

  async revokeToken(refreshToken: string): Promise<void> {
    const response = await fetch(this.revokeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        token: refreshToken,
      }),
    });

    if (!response.ok) {
      let message = "Token revocation failed";
      try {
        const error = await response.json();
        message = error.error_description ?? message;
      } catch {}
      throw new UnauthorizedException(message);
    }
  }

  async fetchUserInfo(accessToken: string): Promise<RopgUserInfoResponse> {
    const response = await fetch(this.userInfoUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      let message = "UserInfo request failed";
      try {
        const error = await response.json();
        message = error.error_description ?? message;
      } catch {}
      throw new UnauthorizedException(message);
    }

    return response.json();
  }
}
