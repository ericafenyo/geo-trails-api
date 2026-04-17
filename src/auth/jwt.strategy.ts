import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.OAUTH_DOMAIN}/.well-known/jwks.json`,
      }),
      issuer: `https://${process.env.OAUTH_DOMAIN}/`,
      audience: process.env.OAUTH_AUDIENCE,
      algorithms: ['RS256'],
    });
  }

  validate(payload: { sub: string }) {
    return { sub: payload.sub };
  }
}
