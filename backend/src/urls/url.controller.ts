import {Body, Controller, Delete, Get, Param, Post} from "@nestjs/common";
import {UrlService} from "./url.service";
import {CreateUrlDto} from "./dto/createUrl.dto";
import {UrlDto} from "./dto/url.dto";


@Controller()
export class UrlController {
    constructor(private readonly urlService: UrlService) {
    }

    @Post()
    async create(@Body() createUrlDto: CreateUrlDto): Promise<UrlDto> {
        console.log(createUrlDto)
        return this.urlService.createUrl(createUrlDto);
    }

    @Get('/:code')
    async get(@Param('code') code: string) : Promise<string> {
        return this.urlService.findUrl(code);
    }

    @Delete('/:code')
    async delete(@Param('code') code: string) {
        await this.urlService.deleteUrl(code);
    }

}