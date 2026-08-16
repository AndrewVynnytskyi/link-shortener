import { ApiProperty } from '@nestjs/swagger';

/** Shape returned to clients for a single shortened link. */
export class UrlResponseDto {
  @ApiProperty() url: string;
  @ApiProperty() shortUrl: string;
  @ApiProperty() clicks: number;
}

/** Paginated list response for `GET /urls/user/:userId/:page` and friends. */
export class PaginatedUrlsDto {
  @ApiProperty() total: number;
  @ApiProperty({ type: [UrlResponseDto] }) urls: UrlResponseDto[];
}
