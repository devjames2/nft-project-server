import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Document } from 'mongoose';

export type EmailSubscriberDocument = EmailSubscriber & Document;

@Schema()
export class EmailSubscriber 
  {
    @Prop()
    emailAddress: String;
    
    @Prop()
    status: Boolean;

    @Prop()
    createdAt: Date;
  }

const schema = SchemaFactory.createForClass(EmailSubscriber);
schema.plugin(mongoosePaginate);
export const EmailSubscriberSchema = schema;