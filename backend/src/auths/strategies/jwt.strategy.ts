import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import * as process from "node:process";
import * as dotenv from 'dotenv'
import {Injectable} from "@nestjs/common";

dotenv.config()

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor() {
        const JwtToken = process.env.JWT_SECRET;
        if(!JwtToken){
            throw new Error('JWT_SECRET not defined');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JwtToken
        });
    }

    validate(args: any): Promise<false | unknown | null> | false | unknown | null {
        return args;
    }


}