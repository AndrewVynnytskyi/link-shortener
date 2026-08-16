import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

/**
 * Validates username/email + password on `POST /auth/login`. On success
 * it hands the signed JWT string to the request as `req.user`; the
 * controller is responsible for wrapping it in a cookie.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'login' });
  }

  async validate(login: string, password: string): Promise<string> {
    const token = await this.authService.validateUser({ login, password });
    if (!token) {
      throw new UnauthorizedException('Invalid login or password');
    }
    return token;
  }
}
