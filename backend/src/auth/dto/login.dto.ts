import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

/**
 * Payload for `POST /auth/login`. `login` accepts either a username or
 * an email — {@link AuthService.validateUser} matches against both.
 */
export class LoginDto {
  @ApiProperty({ example: 'jane_doe' })
  @IsString()
  login: string;

  @ApiProperty()
  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password: string;
}
