import { AuthProvider } from "../interfaces/auth-provider.interface";
import { AuthTokens } from "../outputs/auth-tokens";

export class LoginInteractor {
  constructor(private readonly authProvider: AuthProvider) {}

  async execute(email: string, password: string): Promise<AuthTokens> {
    return this.authProvider.login(email, password);
  }
}
