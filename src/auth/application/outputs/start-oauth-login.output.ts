export interface StartOauthLoginOutput {
  authorizationUrl: string;
  state: string;
  nonce: string;
}
