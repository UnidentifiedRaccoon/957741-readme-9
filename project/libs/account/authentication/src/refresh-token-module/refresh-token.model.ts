import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { JwtToken } from '@project/core';

@Schema({
  collection: 'refresh-sessions',
  timestamps: true
})
export class RefreshTokenModel implements JwtToken {
  @Prop()
  public createdAt: Date;

  @Prop({ required: true })
  public tokenId: string;

  @Prop( { required: true })
  public userId: string;

  @Prop({ required: true })
  public expiresIn: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshTokenModel);

export type RefreshTokenDocument = HydratedDocument<RefreshTokenModel>;