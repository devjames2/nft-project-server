import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ItemVoucher, ItemVoucherSchema } from './schemas/item-voucher.schema';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
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
