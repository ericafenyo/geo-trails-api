import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export const CurrentUser = createParamDecorator(
  (param, context: ExecutionContext): AuthenticatedUser => {
    const req = context.switchToHttp().getRequest();
    return param ? req.user[param] : req.user;
  },
);
