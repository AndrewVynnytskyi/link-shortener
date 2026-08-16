import { ApiProperty } from '@nestjs/swagger';

/** Response for `GET /information/:originalUrl`. */
export class PageTitleDto {
  @ApiProperty({ example: 'Example Domain' })
  title: string;
}
