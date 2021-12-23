import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemVoucherDto } from './dto/create-item-voucher.dto';
// import { AuthGuard } from 'src/auth.guard';
// import { UpdateItemDto } from './dto/update-item-vocher.dto';

// @UseGuards(AuthGuard)
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post('voucher')
  create(@Body() createItemVoucherDto: CreateItemVoucherDto) {
    return this.itemService.createVoucher(createItemVoucherDto);
  }

  @Get('all')
  findAllMyItem(@Query('chain') chain: string, @Query('address') address: string) {
    return this.itemService.findAllMyItem(chain, address);
  }

  @Get('all')
  findAllVoucher() {
    return this.itemService.findAllVoucher();
  }

  @Get('vouchers/:token_address/:token_id')
  findOneVoucher(
    @Param('token_address') token_address: string,
    @Param('token_id') token_id: string
    ) {
    return this.itemService.findOneVoucher(+token_id, token_address);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
  //   return this.itemService.update(+id, updateItemDto);
  // }

  @Delete('vouchers:token_id')
  remove(@Param('token_id') token_id: string) {
    return this.itemService.remove(+token_id);
  }
}
