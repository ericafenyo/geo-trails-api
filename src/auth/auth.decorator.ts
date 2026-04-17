import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedUser {
  sub: string;
}

export const CurrentUser = createParamDecorator(
  (param, context: ExecutionContext): AuthenticatedUser => {
    const req = context.switchToHttp().getRequest();
    return param ? req.user[param] : req.user;
  },
);
