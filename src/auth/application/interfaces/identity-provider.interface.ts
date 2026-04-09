export interface BuildAuthorizationUrlInput {
  state: string;
  nonce: string;
  redirectUri: string;
}

export interface IdentityProvider {
  buildAuthorizationUrl(input: BuildAuthorizationUrlInput): Promise<string>;
}

export const IDENTITY_PROVIDER = Symbol("IDENTITY_PROVIDER");
