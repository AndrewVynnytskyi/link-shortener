import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Payload for `POST /auth/signup`. Password complexity is enforced here
 * so weak credentials never reach {@link AuthService.create}.
 */
export class SignupDto {
  @ApiProperty({ minLength: 3, maxLength: 32, example: 'jane_doe' })
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(32)
  username: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail({}, { message: 'You must provide a valid email address' })
  email: string;

  @ApiProperty({ minLength: 8, example: 'Str0ng!Passw0rd' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'Password must contain at least one special character',
  })
  password: string;
}
