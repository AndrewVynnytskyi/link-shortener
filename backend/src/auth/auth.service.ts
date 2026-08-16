import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { compare, genSalt, hash } from 'bcrypt-ts';
import { User, UserDocument } from './schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/jwt-payload.type';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Builds the JWT claims for a user. Intentionally an explicit field
   * mapping (never an object spread of the Mongoose document) so the
   * password hash can never accidentally end up in a signed token.
   */
  private buildJwtPayload(user: UserDocument): JwtPayload {
    return {
      sub: user._id.toString(),
      username: user.username,
      email: user.email,
    };
  }

  /**
   * Registers a new account. Throws {@link ConflictException} if the
   * username or email is already taken.
   */
  async create(
    signupDto: SignupDto,
  ): Promise<{ username: string; email: string }> {
    const existing = await this.userModel.findOne({
      $or: [{ username: signupDto.username }, { email: signupDto.email }],
    });
    if (existing) {
      throw new ConflictException('Username or email is already in use');
    }

    const passwordHash = await hash(
      signupDto.password,
      await genSalt(SALT_ROUNDS),
    );
    const user = await this.userModel.create({
      username: signupDto.username,
      password: passwordHash,
      email: signupDto.email,
    });

    return { username: user.username, email: user.email };
  }

  /**
   * Verifies credentials for the local strategy. Returns a signed JWT
   * on success, or `null` if the login/password pair is invalid.
   */
  async validateUser(loginDto: LoginDto): Promise<string | null> {
    const user = await this.userModel.findOne({
      $or: [{ username: loginDto.login }, { email: loginDto.login }],
    });
    if (!user) {
      return null;
    }

    const passwordMatches = await compare(loginDto.password, user.password);
    if (!passwordMatches) {
      return null;
    }

    return this.jwtService.sign(this.buildJwtPayload(user));
  }
}
