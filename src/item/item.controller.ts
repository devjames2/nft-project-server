import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemVoucherDto } from './dto/create-item-voucher.dto';
import { AuthGuard } from 'src/auth/auth.guard';
// import { UpdateItemDto } from './dto/update-item-vocher.dto';


@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @UseGuards(AuthGuard)
  @Post('voucher')
  create(@Body() createItemVoucherDto: CreateItemVoucherDto) {
    return this.itemService.createVoucher(createItemVoucherDto);
  }

  @Get('all')
  findAllMyItem(@Query('chain') chain: string, @Query('address') address: string) {
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
    return this.itemService.findOneVoucher(+tokenId, tokenAddress);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
  //   return this.itemService.update(+id, updateItemDto);
  // }

  @UseGuards(AuthGuard)
  @Delete('vouchers:tokenId')
  remove(@Param('tokenId') tokenId: string) {
    return this.itemService.remove(+tokenId);
  }
}
