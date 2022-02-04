import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Document } from 'mongoose';
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export type EmailSubscriberDocument = EmailSubscriber & Document;

@Schema()
export class EmailSubscriber 
  {
    @Prop()
    // @IsNotEmpty()
    // @IsString()
    // @IsEmail()
    emailAddress: String;
    
    @Prop()
    // @IsOptional()
    // @IsBoolean()
    status: Boolean = true;

    @Prop()
    // @IsOptional()
    // @IsDate()
    createdAt: Date = new Date();
  }

const schema = SchemaFactory.createForClass(EmailSubscriber);
schema.plugin(mongoosePaginate);
export const EmailSubscriberSchema = schema;