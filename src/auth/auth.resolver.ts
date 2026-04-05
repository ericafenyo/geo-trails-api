import { UseGuards } from '@nestjs/common';
import { OptType, OptArgs } from '@/otp/otp.types';
import { CurrentUser, AuthenticatedUser } from './auth.decorator';
import { LocalAuthGuard } from './auth.guard';
import { AuthService, JWTokens } from './auth.service';

export class JWTokensType {
  accessToken: string;
  refreshToken: string;
}

export class AuthResolver {
  constructor(private authService: AuthService) {}

  /**
   * Takes the {@link user} information and returns JWT codes
   *
   * @param {AuthenticationArgs} login a GraphQL args with an email and a password
   * @param {AuthenticatedUser} user an {@link AuthenticatedUser} object
   */
  @UseGuards(new LocalAuthGuard())
  async authenticateUser(
    email: string,
    password: string,
     user: AuthenticatedUser,
  ): Promise<JWTokens> {
    return await this.authService.getToken(user);
  }
}
