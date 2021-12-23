import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ItemVoucher, ItemVoucherSchema } from './schemas/item-voucher.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: ItemVoucher.name, schema: ItemVoucherSchema }])],
  controllers: [ItemController],
  providers: [ItemService]
})
export class ItemModule {}
