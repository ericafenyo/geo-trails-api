import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./auth.controller";
import { AUTH_PROVIDER } from "./application/interfaces/auth-provider.interface";
import { RopgAuthProvider } from "./infrastructure/ropg-auth-provider";
import { RopgClient } from "./infrastructure/ropg-client";
import { LoginInteractor } from "./application/interactors/login.interactor";
import { RefreshInteractor } from "./application/interactors/refresh.interactor";
import { RevokeInteractor } from "./application/interactors/revoke.interactor";
import { GetUserInfoInteractor } from "./application/interactors/get-user-info.interactor";

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: "jwt",
    }),
  ],
  providers: [
    JwtStrategy,
    {
      provide: RopgClient,
      useFactory: () => {
        const domain = process.env.OAUTH_DOMAIN;
        const clientId = process.env.OAUTH_CLIENT_ID;
        const clientSecret = process.env.OAUTH_CLIENT_SECRET;
        const audience = process.env.OAUTH_AUDIENCE;
        if (!domain || !clientId || !clientSecret || !audience) {
          throw new Error(
            "Missing required OAuth env vars: OAUTH_DOMAIN, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_AUDIENCE",
          );
        }
        return new RopgClient(domain, clientId, clientSecret, audience);
      },
    },
    {
      provide: AUTH_PROVIDER,
      useFactory: (client: RopgClient) => new RopgAuthProvider(client),
      inject: [RopgClient],
    },
    {
      provide: LoginInteractor,
      useFactory: provider => new LoginInteractor(provider),
      inject: [AUTH_PROVIDER],
    },
    {
      provide: RefreshInteractor,
      useFactory: provider => new RefreshInteractor(provider),
      inject: [AUTH_PROVIDER],
    },
    {
      provide: RevokeInteractor,
      useFactory: provider => new RevokeInteractor(provider),
      inject: [AUTH_PROVIDER],
    },
    {
      provide: GetUserInfoInteractor,
      useFactory: provider => new GetUserInfoInteractor(provider),
      inject: [AUTH_PROVIDER],
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
