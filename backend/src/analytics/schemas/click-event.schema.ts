import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClickEventDocument = HydratedDocument<ClickEvent>;

const NINETY_DAYS_MS = 1000 * 60 * 60 * 24 * 90;

/**
 * One recorded visit to a short link. Kept as its own collection
 * (rather than an array on `Url`) so it can grow unbounded per link
 * without bloating the parent document, and expires automatically
 * after 90 days via a TTL index to bound storage growth.
 */
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class ClickEvent {
  @Prop({ required: true, index: true })
  shortUrl: string;

  @Prop()
  referrer?: string;

  @Prop()
  browser?: string;

  @Prop()
  os?: string;

  @Prop()
  deviceType?: string;

  @Prop({
    type: Date,
    default: () => new Date(Date.now() + NINETY_DAYS_MS),
    expires: 0,
  })
  expiresAt: Date;
}

export const ClickEventSchema = SchemaFactory.createForClass(ClickEvent);
