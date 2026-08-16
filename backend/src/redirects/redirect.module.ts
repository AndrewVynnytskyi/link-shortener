import { Module } from '@nestjs/common';
import { RedirectController } from './redirect.controller';
import { UrlModule } from '../urls/url.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [UrlModule, AnalyticsModule],
  controllers: [RedirectController],
})
export class RedirectModule {}
