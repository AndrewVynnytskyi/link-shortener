import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UrlDocument = HydratedDocument<Url>;

const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30;

/**
 * A shortened link. `expiresAt` drives a MongoDB TTL index so anonymous
 * links are garbage-collected automatically 30 days after creation.
 */
@Schema({ timestamps: true })
export class Url {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true, unique: true, index: true })
  shortUrl: string;

  @Prop({ default: 0 })
  clicks: number;

  @Prop({
    type: Date,
    default: () => new Date(Date.now() + THIRTY_DAYS_MS),
    expires: 0,
  })
  expiresAt: Date;

  @Prop({ required: true, index: true })
  userId: string;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
