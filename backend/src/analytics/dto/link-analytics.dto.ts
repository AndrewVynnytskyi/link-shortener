import { ApiProperty } from '@nestjs/swagger';

export class DailyClickCountDto {
  @ApiProperty({ example: '2026-08-15' }) date: string;
  @ApiProperty() count: number;
}

export class ReferrerCountDto {
  @ApiProperty({ example: 'Direct' }) referrer: string;
  @ApiProperty() count: number;
}

/** Response for `GET /urls/:code/analytics`. */
export class LinkAnalyticsDto {
  @ApiProperty() totalClicks: number;
  @ApiProperty({ type: [DailyClickCountDto] }) last30Days: DailyClickCountDto[];
  @ApiProperty({ type: [ReferrerCountDto] }) topReferrers: ReferrerCountDto[];
}
