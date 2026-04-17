import { AuthProvider } from "../interfaces/auth-provider.interface";
import { AuthTokens } from "../outputs/auth-tokens";

export class RefreshInteractor {
  constructor(private readonly authProvider: AuthProvider) {}

  async execute(refreshToken: string): Promise<AuthTokens> {
    return this.authProvider.refresh(refreshToken);
  }
}
