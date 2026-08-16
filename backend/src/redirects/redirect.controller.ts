import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UrlService } from '../urls/url.service';
import { AnalyticsService } from '../analytics/analytics.service';

@ApiTags('redirects')
@Controller('r')
export class RedirectController {
  constructor(
    private readonly urlService: UrlService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Get(':code')
  @ApiOperation({
    summary: 'Resolve a short code and redirect (302) to the original URL',
  })
  @ApiExcludeEndpoint() // browser navigation endpoint, not a JSON API consumers call directly
  async redirect(
    @Param('code') code: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const url = await this.urlService.findByShortUrlOrThrow(code);

    await Promise.all([
      this.urlService.incrementClicks(code),
      this.analyticsService.recordClick({
        shortUrl: code,
        referrer: req.headers.referer,
        userAgent: req.headers['user-agent'],
      }),
    ]);

    res.redirect(302, url.url);
  }
}
