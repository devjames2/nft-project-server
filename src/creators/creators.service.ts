import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { CreateCreatorDto } from './dto/create-creator.dto';
import { UpdateCreatorDto } from './dto/update-creator.dto';
import { Creators, CreatorsDocument } from './schemas/creators.schema';

@Injectable()
export class CreatorsService {
  constructor(
    @InjectModel(Creators.name)
    private readonly creatorsModel: PaginateModel<CreatorsDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createCreatorsDto: CreateCreatorDto) {
    // insert data into mongodb with mongoose
    const creatorExist = await this.checkCreatorExists(
      createCreatorsDto.accountAddress,
      createCreatorsDto.nickName,
    );
    if (creatorExist) {
      throw new UnprocessableEntityException('Creator already exists');
    }
    const newCreator = new this.creatorsModel(createCreatorsDto);
    return newCreator.save();
  }

  private async checkCreatorExists(
    accountAddress: string,
    nickName: string,
  ): Promise<boolean> {
    const creatorAccount = await this.creatorsModel.findOne({ accountAddress });
    const creatorNickName = await this.creatorsModel.findOne({ nickName });
    if (creatorAccount || creatorNickName) {
      return true;
    }
    return false;
  }

  // Retieve creatorss with pagination
  findAll(page = 1, limit = 5) {
    return this.creatorsModel.paginate(
      {}, // Query
      {
        sort: { createdAt: -1 }, // 최신 순 정렬
        limit, // 개수 제한
        page, // 페이지 번호
      },
    );
  }

  async findOne(_id: string) {
    const result = await this.creatorsModel.findOne({ _id }).select({ __v: 0 });
    if (!result) {
      throw new NotFoundException('creator not found');
    }
    return result;
  }

  update(updateCreatorsDto: UpdateCreatorDto) {
    // update data into mongodb with mongoose
    return this.creatorsModel.updateOne(
      { _id: updateCreatorsDto._id },
      updateCreatorsDto,
    );
  }

  async remove(_id: string) {
    // delete data into mongodb with mongoose
    const result = await this.creatorsModel.findByIdAndDelete({ _id }).exec();

    if (!result) {
      throw new NotFoundException('creator not found');
    }

    return `removes a creator with id : ${_id}`;
  }
}
