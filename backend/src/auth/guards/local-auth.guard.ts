import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Runs the local (login/password) strategy on `POST /auth/login`.
 * Populates `req.user` with the signed JWT string on success.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
