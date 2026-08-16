import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Matches } from 'class-validator';
import { CUSTOM_SLUG_PATTERN } from '../slug.util';

/**
 * Payload for both `POST /urls/anon` and `POST /urls/user`. `shortUrl`
 * is an optional custom back-half; when omitted the service generates
 * one. `userId` is never trusted from the client on the authenticated
 * route — the controller overwrites it with the JWT subject.
 */
export class CreateUrlDto {
  @ApiProperty({ example: 'https://example.com/a/very/long/path' })
  @IsUrl({}, { message: 'You must provide a valid URL' })
  originalUrl: string;

  @ApiPropertyOptional({
    description:
      'Custom back-half, 3-30 alphanumeric/hyphen characters. Omit to auto-generate.',
    example: 'my-launch',
  })
  @IsOptional()
  @Matches(CUSTOM_SLUG_PATTERN, {
    message:
      'Custom back-half must be 3-30 characters, letters/numbers/hyphens only',
  })
  shortUrl?: string;

  /**
   * Owner id. For anonymous links this is the client's anon-id cookie
   * value; for authenticated links the controller overwrites whatever
   * is sent here with the JWT subject, so it can't be spoofed.
   */
  @ApiPropertyOptional({
    description: 'Anonymous client id (ignored on the authenticated route)',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
