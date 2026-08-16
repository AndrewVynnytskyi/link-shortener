import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

/**
 * A registered account. `password` always stores a bcrypt hash — it is
 * never returned from any controller and must never be spread into a
 * JWT payload (see {@link AuthService.buildJwtPayload}).
 */
@Schema({ timestamps: true, collection: 'auths' })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
