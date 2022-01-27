import { Test, TestingModule } from '@nestjs/testing';
import { ItemService } from './item.service';
import { ItemVoucher, ItemVoucherDocument, ItemVoucherSchema } from './schemas/item-voucher.schema';
import { ItemMarket, ItemMarketDocument, ItemMarketSchema } from './schemas/item-market.schema';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('ItemService', () => {
  let mockItemVoucherModel: Model<ItemVoucherDocument>;
  let mockitemMarketrModel: Model<ItemMarketDocument>
  
  let service: ItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(ItemVoucher.name),
          useValue: Model
        },
        {
          provide: getModelToken(ItemMarket.name),
          useValue: Model
        },
        ItemService],
    }).compile();

    mockItemVoucherModel = module.get<Model<ItemVoucherDocument>>(getModelToken(ItemVoucher.name));
    mockitemMarketrModel = module.get<Model<ItemMarketDocument>>(getModelToken(ItemMarket.name));

    service = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
