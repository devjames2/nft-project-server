import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ItemVoucher, ItemVoucherSchema } from './schemas/item-voucher.schema';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [MongooseModule.forFeature([{ name: ItemVoucher.name, schema: ItemVoucherSchema }]),
AuthModule],
  controllers: [ItemController],
  providers: [ItemService]
})
export class ItemModule {}
