import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/createUrl.dto';
import { UrlDto } from './dto/url.dto';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  async create(@Body() createUrlDto: CreateUrlDto): Promise<UrlDto> {
    return this.urlService.createUrl(createUrlDto);
  }

  @Get('/:code')
  async getLinkRedirection(@Param('code') code: string): Promise<string> {
    return this.urlService.findUrl(code);
  }

  @Get('/user/:userid/:page')
  async getAllUserLinks(
    @Param('userid') userId: string,
    @Param('page') page: number,
  ): Promise<UrlDto[]> {
    return this.urlService.getAllUsersUrL(userId, page);
  }

  @Delete('/:code')
  async delete(@Param('code') code: string) {
    await this.urlService.deleteUrl(code);
  }
}
