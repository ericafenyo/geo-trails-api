import { AuthProvider } from "../interfaces/auth-provider.interface";

export class RevokeInteractor {
  constructor(private readonly authProvider: AuthProvider) {}

  async execute(refreshToken: string): Promise<void> {
    return this.authProvider.revoke(refreshToken);
  }
}
