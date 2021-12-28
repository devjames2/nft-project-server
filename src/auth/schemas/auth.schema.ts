import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserAuthInfoDocument = UserAuthInfo & Document;

@Schema()
export class UserAuthInfo 
  {
    @Prop({ required: true, unique: true })           
    accountAddress: String;
    // @Prop({ required: true })
    // signature: String;
    @Prop({ required: true })
    nonce: Number;
  }

export const UserAuthInfoSchema = SchemaFactory.createForClass(UserAuthInfo);