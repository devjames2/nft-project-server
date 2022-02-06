import { Test, TestingModule } from '@nestjs/testing';
import { DropsController } from './drops.controller';
import { DropsService } from './drops.service';

describe('DropsController', () => {
  let controller: DropsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DropsController],
      providers: [DropsService],
    }).compile();

    controller = module.get<DropsController>(DropsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
