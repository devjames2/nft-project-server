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
    token_address: String;
    @Prop()
    token_id: String;
    @Prop()
    token_uri: String;
    @Prop()
    owner_of: String;
    @Prop()
    amount: Number;
    @Prop()
    contract_type: String;
    @Prop()
    metadata: String;
    @Prop()
    is_valid: Number;
    @Prop()
    frozen: Number;
    @Prop()
    min_price: Number;
    @Prop()
    signature: String;
    @Prop()
    creator_address: String;
    @Prop()
    royalty: Number;
    @Prop()
    fee: Number;
  }

export const ItemVoucherSchema = SchemaFactory.createForClass(ItemVoucher);