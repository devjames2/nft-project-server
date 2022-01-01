import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItemVoucher, ItemVoucherDocument } from './schemas/item-voucher.schema';
import { ItemMarket, ItemMarketDocument } from './schemas/item-market.schema';
import { CreateItemVoucherDto } from './dto/create-item-voucher.dto';
// import { UpdateItemDto } from './dto/update-item-vocher.dto';
import Moralis from 'moralis/node.js';
import { SellFixedPriceItemDto } from './dto/sell-fixed-price-item.dto';
// import { BuyNowItemDto } from './dto/buy-now-item.dto';


@Injectable()
export class ItemService {
  constructor(
    @InjectModel(ItemVoucher.name)
    private readonly itemVoucherModel: Model<ItemVoucherDocument>,
    @InjectModel(ItemMarket.name)
    private readonly itemMarketrModel: Model<ItemMarketDocument>
  ) {
    // const Moralis = require(moralis/node); 

    const serverUrl = process.env.MORALIS_SERVER;
    const appId = process.env.MORALIS_APP_ID;
    Moralis.start({ serverUrl, appId });
  }

  async createVoucher(
    createItemVoucherDto: CreateItemVoucherDto,
  ): Promise<ItemVoucher> {
    const newVoucher = await new this.itemVoucherModel(createItemVoucherDto);
    return newVoucher.save();
  }

  async findAllVoucher(): Promise<ItemVoucher[]> {
    const result = await this.itemVoucherModel.find().select({__v: 0});
    if (!result) {
      throw new NotFoundException('vouchers not found');
    }
    return result;
  }

  async findOneVoucher(tokenAddress: string, tokenId: number): Promise<ItemVoucher> {
    const result = await this.itemVoucherModel.findOne()
                                              .where('tokenAddress').equals(tokenAddress)
                                              .where('tokenId').equals(tokenId)
                                              .select({__v: 0});
    if (!result) {
      throw new NotFoundException('voucher not found');
    }
    return result;
  }

  // TODO: define return type
  async findAllMyItem(chain: string, address: string) {
    const lazyMintedItems = await this.itemVoucherModel.find().select({__v: 0});

    // console.log(lazyMintedItems)

    let chainName: 'eth' | 'rinkeby' | 'bsc' | 'bsc testnet'
    if (chain == "rinkeby") {
      chainName = "rinkeby";
    } else if (chain == "bsc-testnet") {
      chainName = "bsc testnet"
    } else if (chain == "eth") {
      chainName = "eth"
    } else if (chain == "bsc") {
      chainName = "bsc"
    } 

    const options = { address: address, chain: chainName };
    const mintedMyNFTs = await Moralis.Web3API.account.getNFTs(options);

    const allItems = [...lazyMintedItems, ...mintedMyNFTs.result]
    // console.log(allItems)
    return allItems
  }

  // update(id: number, updateItemDto: UpdateItemDto) {
  //   return `This action updates a #${id} item`;
  // }

  async remove(tokenId: number): Promise<String> {
    await this.itemVoucherModel.deleteOne({ tokenId }).exec();
    return `This action removes a #${tokenId} item`;
  }

  async sellFixedPriceItem(sellFixedPriceItemDto: SellFixedPriceItemDto): Promise<ItemMarket> {

    const newSellFixedPriceItem = await new this.itemMarketrModel(sellFixedPriceItemDto);
    return newSellFixedPriceItem.save();
  }

  async findAllSellItem(): Promise<ItemMarket[]> {
    const result = await this.itemMarketrModel.find().select({__v: 0});
    if (!result) {
      throw new NotFoundException('item for sell not found');
    }
    return result;
  }

  // async findOneSellItem(tokenAddress: string, tokenId: number): Promise<ItemVoucher> {
  async findOneSellItem(_id: string): Promise<ItemMarket> {
    const result = await this.itemMarketrModel.findOne()
                                              // .where('tokenAddress').equals(tokenAddress)
                                              // .where('tokenId').equals(tokenId)
                                              .select({__v: 0});
    if (!result) {
      throw new NotFoundException('item for sell not found');
    }
    return result;
  }

  // async buyNowItem(buyNowItem: BuyNowItemDto): Promise<BuyNowItemDto> {
  //   // await this.itemVoucherModel.deleteOne({ tokenId }).exec();
  //   // return `This action removes a #${tokenId} item`;
  //   return new BuyNowItemDto();
  // }
}
