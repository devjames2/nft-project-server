import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemVoucherDto } from './dto/create-item-voucher.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { SellFixedPriceItemDto } from './dto/sell-fixed-price-item.dto';
// import { BuyNowItemDto } from './dto/buy-now-item.dto';


@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @UseGuards(AuthGuard)
  @Post('voucher')
  create(@Body() createItemVoucherDto: CreateItemVoucherDto) {
    return this.itemService.createVoucher(createItemVoucherDto);
  }

  @UseGuards(AuthGuard)
  @Post('sell')
  sell(@Body() sellFixedPriceItemDto: SellFixedPriceItemDto) {
    return this.itemService.sellFixedPriceItem(sellFixedPriceItemDto);
  }
  
  @Get('sell')
  findAllSellItem() {
    return this.itemService.findAllSellItem();
  }

  @Get('sell/:_id')
  findOneSellItem(@Param('_id') _id: string) {
    return this.itemService.findOneSellItem(_id);
  }

  // @UseGuards(AuthGuard)
  // @Post('buy')
  // buyNow(@Body() buyItemVoucherDto: BuyNowItemDto) {
  //   return this.itemService.buyNowItem(buyItemVoucherDto);
  // }

  @Get('all')
  findAllMyItem(@Query('chain') chain: string, @Query('accountAddress') address: string) {
    return this.itemService.findAllMyItem(chain, address);
  }

  @Get('vouchers')
  findAllVoucher() {
    return this.itemService.findAllVoucher();
  }

  @Get('vouchers/:tokenAddress/:tokenId')
  findOneVoucher(
    @Param('tokenAddress') tokenAddress: string,
    @Param('tokenId') tokenId: string
    ) {
    return this.itemService.findOneVoucher(tokenAddress, +tokenId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
  //   return this.itemService.update(+id, updateItemDto);
  // }

  @UseGuards(AuthGuard)
  @Delete('vouchers/:tokenId')
  remove(@Param('tokenId') tokenId: string) {
    return this.itemService.remove(+tokenId);
  }
}
