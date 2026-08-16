import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AppConfig } from '../../config/configuration';
import { JwtPayload } from '../types/jwt-payload.type';

/**
 * Reads the JWT from the `jwt` httpOnly cookie set by
 * {@link AuthController} on login/signup. Falls back to a `Bearer`
 * authorization header so the API remains usable from Swagger's
 * "Try it out" panel and non-browser clients.
 */
function extractFromCookie(req: Request): string | null {
  return (req.cookies as Record<string, string> | undefined)?.jwt ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const { jwtSecret } = configService.getOrThrow<AppConfig>('app');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Passport already verifies the signature/expiry before calling this;
   * the decoded claims *are* the payload, so we return them as-is
   * (previously this incorrectly returned `args._doc`, which is
   * `undefined` on a plain decoded JWT object).
   */
  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
