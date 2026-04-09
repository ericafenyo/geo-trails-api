import {
  BuildAuthorizationUrlInput,
  IdentityProvider,
} from "../application/interfaces/identity-provider.interface";
import { StartOauthLoginUseCase } from "../application/use-cases/start-oauth-login.use-case";

describe("StartOauthLoginUseCase", () => {
  it("returns authorization url with generated state and nonce", async () => {
    const calls: BuildAuthorizationUrlInput[] = [];
    const provider: IdentityProvider = {
      async buildAuthorizationUrl(input: BuildAuthorizationUrlInput): Promise<string> {
        calls.push(input);
        return "https://tenant.auth0.com/authorize?state=x&nonce=y";
      },
    };

    const useCase = new StartOauthLoginUseCase(provider);

    const result = await useCase.execute({
      redirectUri: "http://localhost:3000/v1/auth/oauth/callback",
    });

    expect(result.authorizationUrl).toContain("https://tenant.auth0.com/authorize");
    expect(result.state).toBeTruthy();
    expect(result.nonce).toBeTruthy();
    expect(calls).toHaveLength(1);
    expect(calls[0].redirectUri).toBe("http://localhost:3000/v1/auth/oauth/callback");
    expect(calls[0].state).toBe(result.state);
    expect(calls[0].nonce).toBe(result.nonce);
  });

  it("preserves provided state and nonce", async () => {
    const provider: IdentityProvider = {
      async buildAuthorizationUrl(): Promise<string> {
        return "https://tenant.auth0.com/authorize?state=provided-state&nonce=provided-nonce";
      },
    };

    const useCase = new StartOauthLoginUseCase(provider);

    const result = await useCase.execute({
      redirectUri: "http://localhost:3000/v1/auth/oauth/callback",
      state: "provided-state",
      nonce: "provided-nonce",
    });

    expect(result.state).toBe("provided-state");
    expect(result.nonce).toBe("provided-nonce");
  });
});
