import { UnauthorizedException, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from './auth.decorator';
import { errors } from '../errors';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<AuthenticatedUser> {
    
    const user = await this.authService.validateUserWithEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException(errors.user.invalidCredentials);
    }
    return user;
  }
}
