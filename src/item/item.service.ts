import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItemVoucher, ItemVoucherDocument } from './schemas/item-voucher.schema';
import { CreateItemVoucherDto } from './dto/create-item-voucher.dto';
// import { UpdateItemDto } from './dto/update-item-vocher.dto';
import Moralis from 'moralis/node.js';


@Injectable()
export class ItemService {
  constructor(
    @InjectModel(ItemVoucher.name)
    private readonly itemVoucherModel: Model<ItemVoucherDocument>
  ) {
    // const Moralis = require(moralis/node); 

    const serverUrl = process.env.MORALIS_SERVER;
    const appId = process.env.MORALIS_APP_ID;
    console.log(appId);
    Moralis.start({ serverUrl, appId });
  }

  async createVoucher(
    createItemVoucherDto: CreateItemVoucherDto,
  ): Promise<ItemVoucher> {
    const newVoucher = await new this.itemVoucherModel(createItemVoucherDto);
    return newVoucher.save();
  }

  async findAllVoucher(): Promise<ItemVoucher[]> {
    const result = await this.itemVoucherModel.find().exec();
    if (!result) {
      throw new NotFoundException('vouchers not found');
    }
    return result;
  }

  async findOneVoucher(token_id: number, token_address: string): Promise<ItemVoucher> {
    // this.ItemVoucherModel.find().exec()
    const result = await this.itemVoucherModel.findOne({ token_id, token_address }).exec();
    if (!result) {
      throw new NotFoundException('voucher not found');
    }
    return result;
  }

  // TODO: define return type
  async findAllMyItem(chain: string, address: string) {
    const lazyMintedItems = await this.itemVoucherModel.find().exec();

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

  async remove(token_id: number): Promise<String> {
    await this.itemVoucherModel.deleteOne({ token_id }).exec();
    return `This action removes a #${token_id} item`;
  }
}
