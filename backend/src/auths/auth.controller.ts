import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';
import { Request } from 'express';
import { AuthDto } from './dto/auth.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('signup')
  async signUp(@Body() authDto: AuthDto) {
    return await this.authService.create(authDto);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: Request): Promise<Express.User | undefined> {
    return req.user;
  }

  @Get('status')
  @UseGuards(JwtGuard)
  async status(@Req() req: Request): Promise<Express.User | undefined> {
    return (req.user);
  }
}