import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Requires a valid JWT (from the `jwt` cookie or `Authorization: Bearer`
 * header). Populates `req.user` with {@link JwtPayload} on success.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
