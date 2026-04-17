export interface StartOauthLoginResponse {
  authorization_url: string;
  state: string;
  nonce: string;
}
