import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UAParser } from 'ua-parser-js';
import { ClickEvent } from './schemas/click-event.schema';
import { LinkAnalyticsDto } from './dto/link-analytics.dto';

const LOOKBACK_DAYS = 30;
const TOP_REFERRERS_LIMIT = 5;
const DIRECT_REFERRER_LABEL = 'Direct';

export interface RecordClickInput {
  shortUrl: string;
  referrer?: string;
  userAgent?: string;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectModel(ClickEvent.name)
    private readonly clickEventModel: Model<ClickEvent>,
  ) {}

  /**
   * Persists a click event. Never throws to the caller — analytics is a
   * best-effort side effect of a redirect and must not block or break
   * the redirect itself if the write fails.
   */
  async recordClick({
    shortUrl,
    referrer,
    userAgent,
  }: RecordClickInput): Promise<void> {
    try {
      const { browser, os, device } = userAgent
        ? new UAParser(userAgent).getResult()
        : {
            browser: undefined,
            os: undefined,
            device: undefined,
          };
      await this.clickEventModel.create({
        shortUrl,
        referrer: referrer || undefined,
        browser: browser?.name,
        os: os?.name,
        deviceType: device?.type ?? 'desktop',
      });
    } catch (error) {
      this.logger.warn(
        `Failed to record click for "${shortUrl}": ${(error as Error).message}`,
      );
    }
  }

  /**
   * Builds the analytics summary for a link: total clicks, a daily
   * click count for the last 30 days, and the top referrers.
   */
  async getSummary(shortUrl: string): Promise<LinkAnalyticsDto> {
    const since = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);

    const [totalClicks, dailyCounts, topReferrers] = await Promise.all([
      this.clickEventModel.countDocuments({ shortUrl }),
      this.clickEventModel.aggregate<{ _id: string; count: number }>([
        { $match: { shortUrl, createdAt: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      this.clickEventModel.aggregate<{ _id: string; count: number }>([
        { $match: { shortUrl } },
        {
          $group: {
            _id: { $ifNull: ['$referrer', DIRECT_REFERRER_LABEL] },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: TOP_REFERRERS_LIMIT },
      ]),
    ]);

    return {
      totalClicks,
      last30Days: dailyCounts.map(({ _id, count }) => ({ date: _id, count })),
      topReferrers: topReferrers.map(({ _id, count }) => ({
        referrer: _id,
        count,
      })),
    };
  }
}
