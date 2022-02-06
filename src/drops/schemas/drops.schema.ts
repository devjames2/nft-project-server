import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Document } from 'mongoose';
import { DropSalesType } from '../dto/create-drop.dto';
import { DropNFTDto } from '../dto/drop-nft.dto';

export type DropsDocument = Drops & Document;

@Schema()
export class Drops
  {
    @Prop()
    dropName: string;
    @Prop()
    status: string;
    @Prop()
    dropSalesType: DropSalesType;
    @Prop()
    shortDescription: string;
    @Prop()
    longDescription: string;
    @Prop()
    mainThumbnail: string;
    @Prop()
    mainBannerThumbnailPC: string;
    @Prop()
    mainBannerThumbnailMobile: string;
    @Prop()
    dropNFTs: DropNFTDto[];
    @Prop()
    creators: string[];
    @Prop()
    dropStartDate: Date;
    @Prop()
    dropEndDate: Date;
    @Prop()
    timezone: string;
    @Prop()
    createdAt: Date;
  }

const schema = SchemaFactory.createForClass(Drops);
schema.plugin(mongoosePaginate);
export const DropsSchema = schema;