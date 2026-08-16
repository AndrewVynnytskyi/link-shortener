import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url, UrlDocument } from './schemas/url.schema';
import { UrlResponseDto, PaginatedUrlsDto } from './dto/url-response.dto';
import { CreateUrlDto } from './dto/create-url.dto';
import { generateSlug } from './slug.util';

const PAGE_SIZE = 10;
const MAX_SLUG_GENERATION_ATTEMPTS = 5;

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private readonly urlModel: Model<Url>) {}

  private toResponseDto(url: UrlDocument): UrlResponseDto {
    return { url: url.url, shortUrl: url.shortUrl, clicks: url.clicks };
  }

  /**
   * Resolves a requested short code to a unique slug: validates
   * uniqueness for a user-supplied custom slug (throws
   * {@link ConflictException} if taken), or generates a fresh random
   * one, retrying on the astronomically unlikely event of a collision.
   */
  private async resolveSlug(
    requestedSlug: string | undefined,
  ): Promise<string> {
    if (requestedSlug) {
      const taken = await this.urlModel.exists({ shortUrl: requestedSlug });
      if (taken) {
        throw new ConflictException('This custom link is already taken');
      }
      return requestedSlug;
    }

    for (let attempt = 0; attempt < MAX_SLUG_GENERATION_ATTEMPTS; attempt++) {
      const candidate = generateSlug();
      const taken = await this.urlModel.exists({ shortUrl: candidate });
      if (!taken) {
        return candidate;
      }
    }
    throw new ConflictException(
      'Could not generate a unique short link, please try again',
    );
  }

  async createUrl(createUrlDto: CreateUrlDto): Promise<UrlResponseDto> {
    const shortUrl = await this.resolveSlug(createUrlDto.shortUrl);
    const created = await this.urlModel.create({
      url: createUrlDto.originalUrl,
      shortUrl,
      clicks: 0,
      userId: createUrlDto.userId,
    });
    return this.toResponseDto(created);
  }

  /** Loads a link by its short code or throws {@link NotFoundException}. */
  async findByShortUrlOrThrow(shortUrl: string): Promise<UrlDocument> {
    const url = await this.urlModel.findOne({ shortUrl }).exec();
    if (!url) {
      throw new NotFoundException('Short link not found');
    }
    return url;
  }

  /** Atomically increments the click counter, used by the redirect route. */
  async incrementClicks(shortUrl: string): Promise<void> {
    await this.urlModel.updateOne({ shortUrl }, { $inc: { clicks: 1 } }).exec();
  }

  async listByUser(userId: string, page: number): Promise<PaginatedUrlsDto> {
    const [urls, total] = await Promise.all([
      this.urlModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .skip(page * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .exec(),
      this.urlModel.countDocuments({ userId }).exec(),
    ]);

    return { total, urls: urls.map((url) => this.toResponseDto(url)) };
  }

  /**
   * Deletes a link, but only if `requesterId` owns it. Anonymous
   * requesters pass their client-side anon id; authenticated requesters
   * pass their JWT subject.
   */
  async deleteUrl(shortUrl: string, requesterId: string): Promise<void> {
    const url = await this.findByShortUrlOrThrow(shortUrl);
    if (url.userId !== requesterId) {
      throw new ForbiddenException(
        'You do not have permission to delete this link',
      );
    }
    await this.urlModel.deleteOne({ shortUrl }).exec();
  }
}
