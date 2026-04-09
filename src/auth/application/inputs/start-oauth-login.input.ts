export interface StartOauthLoginInput {
  redirectUri: string;
  state?: string;
  nonce?: string;
}
