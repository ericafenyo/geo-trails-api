import { UnauthorizedException, Injectable } from "@nestjs/common";
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthenticatedUser } from "./auth.decorator";
import { errors } from "../errors";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<AuthenticatedUser> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException(errors.user.invalidCredentials);
    }
    return user;
  }
}
