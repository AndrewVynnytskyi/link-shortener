import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../../auth/types/jwt-payload.type';

/**
 * Extracts the authenticated user's JWT payload from the request.
 * Only valid on routes guarded by {@link JwtAuthGuard} — use after
 * `@UseGuards(JwtAuthGuard)`, e.g. `@CurrentUser() user: JwtPayload`.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as JwtPayload;
  },
);
