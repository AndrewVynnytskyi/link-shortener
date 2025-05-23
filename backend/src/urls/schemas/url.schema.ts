import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";

export type UrlDocument = HydratedDocument<Url>

@Schema({timestamps:true})
export class Url{
    @Prop()
    url:string;
    @Prop()
    shortUrl:string;
    @Prop()
    clicks:number;
    @Prop({type:Date, default:() => new Date(1000*60 * 60 * 24 * 30 + Date.now()), expires:0})
    expiresAt:Date;
    @Prop({required:true, index:true})
    userId:String;
}

export const UrlSchema = SchemaFactory.createForClass(Url);