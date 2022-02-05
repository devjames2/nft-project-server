import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Document } from 'mongoose';

export type UsersDocument = Users & Document;

@Schema()
export class Users
  {
    @Prop()
    accountAddress: String;
    
    @Prop()
    nickName: string;

    @Prop()
    createdAt: Date;
  }

const schema = SchemaFactory.createForClass(Users);
schema.plugin(mongoosePaginate);
export const UsersSchema = schema;