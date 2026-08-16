import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { ClickEvent, ClickEventSchema } from './schemas/click-event.schema';
import { UrlModule } from '../urls/url.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClickEvent.name, schema: ClickEventSchema },
    ]),
    UrlModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
