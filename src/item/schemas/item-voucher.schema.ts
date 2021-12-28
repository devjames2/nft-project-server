import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemVoucherDocument = ItemVoucher & Document;

@Schema()
export class ItemVoucher 
  {
    @Prop()           
    name: String;
    @Prop()
    symbol: String;
    @Prop()
    tokenAddress?: String;
    @Prop()
    tokenId?: String;
    @Prop()
    tokenUri: String;
    @Prop()
    ownerOf: String;
    @Prop()
    amount: Number;
    @Prop()
    contractType: String;
    @Prop()
    metadata: String;
    @Prop()
    isValid: Number;
    @Prop()
    frozen: Number;
    @Prop()
    minPrice: Number;
    @Prop()
    signature: String;
    @Prop()
    creatorAddress: String;
    @Prop()
    royalty: Number;
    @Prop()
    fee: Number;
  }

export const ItemVoucherSchema = SchemaFactory.createForClass(ItemVoucher);