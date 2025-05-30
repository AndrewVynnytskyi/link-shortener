import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument} from "mongoose";
import { IsEmail } from 'class-validator';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({timestamps:true})
export class Auth{
    @Prop()
    username:string
    @Prop()
    password:string
    @Prop()
    @IsEmail()
    email: string
}

export const AuthSchema =  SchemaFactory.createForClass(Auth);