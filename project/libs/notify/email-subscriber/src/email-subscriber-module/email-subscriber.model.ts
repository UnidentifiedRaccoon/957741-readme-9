import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Subscriber } from '@project/core';

@Schema({
  collection: 'email-subscribers',
  timestamps: true,
})
export class EmailSubscriberModel implements Subscriber {
  @Prop({ required: true, unique: true })
  public email: string;

  @Prop({ required: true })
  public firstname: string;

  @Prop({ required: true })
  public lastname: string;
}

export const EmailSubscriberSchema = SchemaFactory.createForClass(EmailSubscriberModel);

export type EmailSubscriberDocument = HydratedDocument<EmailSubscriberModel>;

