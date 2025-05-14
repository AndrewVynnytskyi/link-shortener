import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Res} from "@nestjs/common";
import {UrlService} from "./url.service";
import {CreateUrlDto} from "./dto/createUrl.dto";
import {UrlDto} from "./dto/url.dto";
import {Response} from "express";

@Controller()
export class UrlController {
    constructor(private readonly urlService: UrlService) {
    }

    @Post()
    async create(@Body() createUrlDto: CreateUrlDto): Promise<UrlDto> {
        return this.urlService.createUrl(createUrlDto);
    }

    @Get('/:code')
    async get(@Res() res: Response, @Param('code') code: string) {
        res.redirect(HttpStatus.FOUND, await this.urlService.findUrl(code));
    }

    @Delete('/:code')
    async delete(@Param('code') code: string) {
        await this.urlService.deleteUrl(code);
    }

}