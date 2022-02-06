import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ItemVoucher, ItemVoucherSchema } from './schemas/item-voucher.schema';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { ItemMarket, ItemMarketSchema } from './schemas/item-market.schema';


@Module({
  imports: [MongooseModule.forFeature([
    { name: ItemVoucher.name, schema: ItemVoucherSchema },
    { name: ItemMarket.name, schema: ItemMarketSchema }
  ]),
AuthModule],
  controllers: [ItemController],
  providers: [ItemService]
})
export class ItemModule {}
