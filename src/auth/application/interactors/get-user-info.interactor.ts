import { AuthProvider } from "../interfaces/auth-provider.interface";
import { UserInfo } from "../outputs/user-info";

export class GetUserInfoInteractor {
  constructor(private readonly authProvider: AuthProvider) {}

  async execute(accessToken: string): Promise<UserInfo> {
    return this.authProvider.getUserInfo(accessToken);
  }
}
