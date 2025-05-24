import { HttpException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from './schema/auth.schema';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt-ts';


@Injectable()
export class AuthService {
  constructor(@InjectModel(Auth.name) private AuthModel: Model<Auth>,
              private jwtService: JwtService) {
  }


  async create(authDto: AuthDto) {
    if (await this.AuthModel.findOne({ username: authDto.username })) {
      return new HttpException('The username exists', 401);
    }
    return await this.AuthModel.create(
      {
        username: authDto.username,
        password: await hash(authDto.password, await genSalt(10)),
      },
    );
  }

  async validateUser(authDto: AuthDto): Promise<string | null> {
    const user = await this.AuthModel.findOne({ username: authDto.username });
    if (!user) {
      return null;
    }
    if (await compare(authDto.password, user.password)) {
      const { password, ...buffUser } = user;
      return this.jwtService.sign(buffUser);
    }
    return null;
  }
}