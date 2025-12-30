import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

/**
 * An auth guard implementation for GraphQL using the local passport strategy.
 * I explicitly passed in the 'local' strategy because the nestjs {@link AuthGuard} is
 * a function and I didn't find a way to pass in props from my LocalAuthGuard constructor injection.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Reconstruct the ExecutionContext to be compatible with a GraphQL requests.
    // const ctx = GqlExecutionContext.create(context);
    // This code extracts the HTTP request body.
    // I wonder why it was in #getResponse() and not #getRequest()
    const body = context.switchToHttp().getResponse();

    // Reconstruct the request an attached our custom body because
    // the original body was just a stringified GraphQL query.
    const request = context.switchToHttp().getRequest();
    request.body = body;
    return super.canActivate(new ExecutionContextHost([request]));
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
