import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuthUser } from '@project/core';

@Schema({
  collection: 'accounts',
  timestamps: true,
})
export class BlogUserModel extends Document implements AuthUser {
  @Prop()
  public avatar: string;

  @Prop()
  public dateOfBirth: Date;

  @Prop({unique: true})
  public email: string;

  @Prop()
  public firstname: string;

  @Prop()
  public lastname: string;

  @Prop()
  public passwordHash: string;

}

export const BlogUserSchema = SchemaFactory.createForClass(BlogUserModel);