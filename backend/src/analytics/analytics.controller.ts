import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { LinkAnalyticsDto } from './dto/link-analytics.dto';
import { UrlService } from '../urls/url.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly urlService: UrlService,
  ) {}

  private async assertOwnership(
    code: string,
    requesterId: string,
  ): Promise<void> {
    const url = await this.urlService.findByShortUrlOrThrow(code);
    if (url.userId !== requesterId) {
      throw new ForbiddenException(
        'You do not have permission to view analytics for this link',
      );
    }
  }

  @Get('anon/:anonId/:code')
  @ApiOperation({ summary: "Get an anonymous client's link analytics" })
  async getForAnonymous(
    @Param('anonId') anonId: string,
    @Param('code') code: string,
  ): Promise<LinkAnalyticsDto> {
    await this.assertOwnership(code, anonId);
    return this.analyticsService.getSummary(code);
  }

  @Get('user/:code')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get the authenticated user's link analytics" })
  async getForOwner(
    @CurrentUser() user: JwtPayload,
    @Param('code') code: string,
  ): Promise<LinkAnalyticsDto> {
    await this.assertOwnership(code, user.sub);
    return this.analyticsService.getSummary(code);
  }
}
