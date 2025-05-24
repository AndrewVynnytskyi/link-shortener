import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {UrlModule} from "./urls/url.module";
import * as dotenv from "dotenv";
import {AuthModule} from "./auths/auth.module";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}


@Module({
    imports: [MongooseModule.forRoot(DATABASE_URL), UrlModule, AuthModule],
})
export class AppModule {
}
