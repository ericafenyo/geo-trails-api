import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Resource } from "@/types/resource";
import { LoginInteractor } from "./application/interactors/login.interactor";
import { AuthTokens } from "./application/outputs/auth-tokens";
import { UserInfo } from "./application/outputs/user-info";
import { RefreshInteractor } from "./application/interactors/refresh.interactor";
import { RevokeInteractor } from "./application/interactors/revoke.interactor";
import { GetUserInfoInteractor } from "./application/interactors/get-user-info.interactor";
import { LoginRequest } from "./login.request";
import { RefreshTokenRequest } from "./refresh-token.request";
import { JwtAuthGuard } from "./auth.guard";

@ApiTags("auth")
@Controller({
  path: "auth",
  version: "1",
})
export class AuthController {
  constructor(
    private loginInteractor: LoginInteractor,
    private refreshInteractor: RefreshInteractor,
    private revokeInteractor: RevokeInteractor,
    private getUserInfoInteractor: GetUserInfoInteractor,
  ) {}

  @ApiOperation({ summary: "Log in and receive access, refresh, and id tokens" })
  @ApiOkResponse({
    description: "JWT tokens wrapped in a resource payload",
    schema: {
      type: "object",
      properties: {
        data: {
          type: "object",
          properties: {
            id: { type: "string", example: "current" },
            type: { type: "string", example: "tokens" },
            attributes: {
              type: "object",
              properties: {
                accessToken: { type: "string" },
                refreshToken: { type: "string" },
                idToken: { type: "string" },
              },
            },
          },
        },
      },
    },
  })
  @Post("login")
  async login(@Body() request: LoginRequest): Promise<Resource<AuthTokens>> {
    const tokens = await this.loginInteractor.execute(request.email, request.password);
    return Resource.create({ id: "current", type: "tokens", attributes: tokens });
  }

  @ApiOperation({ summary: "Refresh tokens using a refresh token" })
  @ApiOkResponse({
    description: "Refreshed JWT tokens wrapped in a resource payload",
  })
  @Post("refresh")
  async refresh(@Body() request: RefreshTokenRequest): Promise<Resource<AuthTokens>> {
    const tokens = await this.refreshInteractor.execute(request.refreshToken);
    return Resource.create({ id: "current", type: "tokens", attributes: tokens });
  }

  @ApiOperation({ summary: "Revoke a refresh token" })
  @ApiOkResponse({
    description: "Revocation result wrapped in a resource payload",
  })
  @Post("revoke")
  async revoke(@Body() request: RefreshTokenRequest): Promise<Resource<{ revoked: true }>> {
    await this.revokeInteractor.execute(request.refreshToken);
    return Resource.create({
      id: "current",
      type: "revoke",
      attributes: { revoked: true },
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Fetch the current user's profile from the access token" })
  @ApiOkResponse({
    description: "User profile wrapped in a resource payload",
  })
  @ApiUnauthorizedResponse({ description: "Missing or invalid bearer token" })
  @Get("me")
  @UseGuards(JwtAuthGuard)
  async me(@Headers("authorization") authorization?: string): Promise<Resource<UserInfo>> {
    const token = this.extractBearerToken(authorization);
    const userInfo = await this.getUserInfoInteractor.execute(token);
    return Resource.create({
      id: "current",
      type: "user_info",
      attributes: userInfo,
    });
  }

  private extractBearerToken(authorization?: string): string {
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or invalid bearer token");
    }

    return authorization.slice("Bearer ".length).trim();
  }
}
