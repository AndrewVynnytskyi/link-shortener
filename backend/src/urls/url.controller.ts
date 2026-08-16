import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { PaginatedUrlsDto, UrlResponseDto } from './dto/url-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';

@ApiTags('urls')
@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('anon')
  @ApiOperation({
    summary: 'Create a short link as an anonymous (cookie-identified) client',
  })
  async createAnonymous(
    @Body() createUrlDto: CreateUrlDto,
  ): Promise<UrlResponseDto> {
    return this.urlService.createUrl(createUrlDto);
  }

  @Post('user')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create a short link owned by the authenticated user',
  })
  async createForUser(
    @CurrentUser() user: JwtPayload,
    @Body() createUrlDto: CreateUrlDto,
  ): Promise<UrlResponseDto> {
    return this.urlService.createUrl({ ...createUrlDto, userId: user.sub });
  }

  @Get('anon/:anonId/:page')
  @ApiOperation({
    summary: "List an anonymous client's links by their client id",
  })
  async listAnonymousUrls(
    @Param('anonId') anonId: string,
    @Param('page', ParseIntPipe) page: number,
  ): Promise<PaginatedUrlsDto> {
    return this.urlService.listByUser(anonId, page);
  }

  @Get('user/:page')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "List the authenticated user's links" })
  async listOwnUrls(
    @CurrentUser() user: JwtPayload,
    @Param('page', ParseIntPipe) page: number,
  ): Promise<PaginatedUrlsDto> {
    return this.urlService.listByUser(user.sub, page);
  }

  @Delete('anon/:anonId/:code')
  @ApiOperation({ summary: 'Delete a link owned by an anonymous client' })
  async deleteAnonymous(
    @Param('anonId') anonId: string,
    @Param('code') code: string,
  ): Promise<void> {
    await this.urlService.deleteUrl(code, anonId);
  }

  @Delete('user/:code')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a link owned by the authenticated user' })
  async deleteOwn(
    @CurrentUser() user: JwtPayload,
    @Param('code') code: string,
  ): Promise<void> {
    await this.urlService.deleteUrl(code, user.sub);
  }
}
