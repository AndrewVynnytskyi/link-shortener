import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { PageTitleDto } from './dto/page-title.dto';

const UNTITLED_PAGE = 'Untitled Page';
const FETCH_TIMEOUT_MS = 5000;
const REQUEST_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
};

/**
 * Fetches the `<title>` of an arbitrary destination URL so the frontend
 * can show a human-readable name for a link instead of the raw
 * destination. Best-effort: any failure (timeout, non-HTML, blocked)
 * degrades to a generic placeholder rather than propagating an error.
 */
@ApiTags('information')
@Controller('information')
export class InformationController {
  private readonly logger = new Logger(InformationController.name);

  @Get(':originalUrl')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: 'Fetch the page title of a destination URL' })
  async getTitle(
    @Param('originalUrl') originalUrl: string,
  ): Promise<PageTitleDto> {
    try {
      const decodedUrl = decodeURIComponent(originalUrl);
      const { data } = await axios.get<string>(decodedUrl, {
        headers: REQUEST_HEADERS,
        timeout: FETCH_TIMEOUT_MS,
        responseType: 'text',
      });
      const $ = cheerio.load(data);
      const title = $('title').text().trim();
      return { title: title || UNTITLED_PAGE };
    } catch (error) {
      this.logger.warn(
        `Failed to fetch title for "${originalUrl}": ${(error as Error).message}`,
      );
      return { title: UNTITLED_PAGE };
    }
  }
}
