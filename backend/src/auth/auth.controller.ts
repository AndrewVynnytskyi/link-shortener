import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignupDto } from './dto/signup.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from './types/jwt-payload.type';
import { AppConfig } from '../config/configuration';
import { parseDurationToMs } from './utils/duration.util';

const JWT_COOKIE_NAME = 'jwt';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private setAuthCookie(response: Response, token: string): void {
    const { nodeEnv, jwtExpiresIn, cookieDomain } =
      this.configService.getOrThrow<AppConfig>('app');
    response.cookie(JWT_COOKIE_NAME, token, {
      httpOnly: true,
      secure: nodeEnv === 'production',
      sameSite: 'lax',
      domain: cookieDomain,
      maxAge: parseDurationToMs(jwtExpiresIn),
      path: '/',
    });
  }

  @Post('signup')
  @ApiOperation({ summary: 'Create a new account' })
  async signUp(
    @Body() signupDto: SignupDto,
  ): Promise<{ username: string; email: string }> {
    return this.authService.create(signupDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Log in and receive an httpOnly session cookie' })
  login(
    @Req() { user: token }: { user: string },
    @Res({ passthrough: true }) response: Response,
  ): { success: true } {
    this.setAuthCookie(response, token);
    return { success: true };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Clear the session cookie' })
  logout(@Res({ passthrough: true }) response: Response): { success: true } {
    response.clearCookie(JWT_COOKIE_NAME, { path: '/' });
    return { success: true };
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Return the currently authenticated user' })
  status(@CurrentUser() user: JwtPayload): JwtPayload {
    return user;
  }
}
