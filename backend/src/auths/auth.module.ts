import {Module} from "@nestjs/common";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {JwtModule} from "@nestjs/jwt";
import * as process from "node:process";
import {MongooseModule} from "@nestjs/mongoose";
import {Auth, AuthSchema} from "./schema/auth.schema";
import {PassportModule} from "@nestjs/passport";
import {LocalStrategy} from "./strategies/local.strategy";
import {JwtStrategy} from "./strategies/jwt.strategy";

@Module({
    imports:[JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: {expiresIn:'2d'},
    }),
        PassportModule,
    MongooseModule.forFeature([{name:Auth.name, schema:AuthSchema}])],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}