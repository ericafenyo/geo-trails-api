import { randomUUID } from "crypto";

import { IdentityProvider } from "../interfaces/identity-provider.interface";
import { StartOauthLoginInput } from "../inputs/start-oauth-login.input";
import { StartOauthLoginOutput } from "../outputs/start-oauth-login.output";

export class StartOauthLoginUseCase {
  constructor(private readonly identityProvider: IdentityProvider) {}

  async execute(input: StartOauthLoginInput): Promise<StartOauthLoginOutput> {
    const state = input.state ?? randomUUID();
    const nonce = input.nonce ?? randomUUID();

    const authorizationUrl = await this.identityProvider.buildAuthorizationUrl({
      state,
      nonce,
      redirectUri: input.redirectUri,
    });

    return {
      authorizationUrl,
      state,
      nonce,
    };
  }
}
