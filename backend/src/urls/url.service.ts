import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {nanoid} from "nanoid";
import {Url} from "./schemas/url.schema";
import {UrlDto} from "./dto/url.dto";
import {CreateUrlDto} from "./dto/createUrl.dto";

@Injectable()
export class UrlService {
    constructor(@InjectModel(Url.name) private UrlModel: Model<Url>) {
    }

    async createUrl(createUrlDto: CreateUrlDto): Promise<UrlDto> {
        const shortUrl = nanoid(15);
        return await this.UrlModel.create({
            url: createUrlDto.originalUrl,
            shortUrl: shortUrl,
            clicks: 0,
        });
    }

    async findUrl(shortUrl: string): Promise<string> {
        const urls = await this.UrlModel.findOne({shortUrl: shortUrl}).exec();
        if (!urls) {
            throw new NotFoundException("The url not found")
        }
        urls.clicks++;
        await urls.save();
        return urls.url;
    }

    async deleteUrl(shortUrl: string) {
        await this.UrlModel.deleteOne({shortUrl: shortUrl})
    }
}