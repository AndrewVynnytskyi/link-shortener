import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { UrlService } from "./url.service";
import { CreateUrlDto } from "./dto/createUrl.dto";
import { UrlDto } from "./dto/url.dto";
import { JwtGuard } from "../auths/guards/jwt.guard";
import { Request } from "express";
import { JwtUserPayload } from "../types/user";

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {
  }

  @Post('/anon')
  async createAnonymous(@Body() createUrlDto: CreateUrlDto): Promise<UrlDto> {
    return this.urlService.createUrl(createUrlDto);
  }

  @Post('/user')
  @UseGuards(JwtGuard)
  async createUser(@Req() req: Request, @Body() createUrlDto: CreateUrlDto): Promise<UrlDto> {
    const res = req.user as JwtUserPayload;
    return this.urlService.createUrl({
      originalUrl: createUrlDto.originalUrl,
      shortUrl: createUrlDto.shortUrl,
      userId: res._id
    });
  }


  @Get("/:code")
  async getLinkRedirection(@Param("code") code: string): Promise<string> {
    return this.urlService.findUrl(code);
  }

  @Get("/user/:userid/:page")
  async getAllUserLinks(
    @Param("userid") userId: string,
    @Param("page") page: number
  ): Promise<UrlDto[]> {
    return this.urlService.getAllUsersUrL(userId, page);
  }

  @Get("/logged-user/:page")
  @UseGuards(JwtGuard)
  async getAllLoggedUserLinks(
    @Param("page") page: number, @Req() req: Request
  ) {
    const res = req.user as JwtUserPayload;
    return this.urlService.getAllUsersUrL(res._id, page);
  }

  @Delete("/:code")
  async delete(@Param("code") code: string) {
    await this.urlService.deleteUrl(code);
  }
}
