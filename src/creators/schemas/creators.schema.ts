import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Document } from 'mongoose';

export type CreatorsDocument = Creators & Document;

@Schema()
export class Creators
  {
    @Prop()
    accountAddress: string;
    @Prop()
    nickName: string;
    @Prop()
    status: number;
    @Prop()
    shortDescription: string;
    @Prop()
    longDescription: string;
    @Prop()
    profileThumbnail: string;
    @Prop()
    backwallThumbnail: string;
    @Prop()
    mainBannerThumbnailPC: string;
    @Prop()
    mainBannerThumbnailMobile: string;
    @Prop()
    instagram: string;
    @Prop()
    twitter: string;
    @Prop()
    tiktok: string;
    @Prop()
    homepage: string;
    @Prop()
    createdAt: Date = new Date();
  }

const schema = SchemaFactory.createForClass(Creators);
schema.plugin(mongoosePaginate);
export const CreatorsSchema = schema;