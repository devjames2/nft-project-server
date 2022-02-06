import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { CreateDropDto } from './dto/create-drop.dto';
import { UpdateDropDto } from './dto/update-drop.dto';
import { Drops, DropsDocument } from './schemas/drops.schema';

@Injectable()
export class DropsService {
  constructor(
    @InjectModel(Drops.name)
    private readonly dropsModel: PaginateModel<DropsDocument>,
    private readonly jwtService: JwtService) { }

  async create(createDropDto: CreateDropDto) {
    // insert data into mongodb with mongoose
    const creatorExist = await this.checkDropExists(createDropDto.dropName);
    if (creatorExist) {
      throw new UnprocessableEntityException('Drop already exists');
    }
    const newCreator = new this.dropsModel(createDropDto);
    return newCreator.save();
  }

  private async checkDropExists(dropName: string): Promise<boolean> {
    const drop = await this.dropsModel.findOne({ dropName });
    if (drop) {
      return true;
    }
    return false;
  }

  // Retieve creatorss with pagination
  findAll(page: number = 1, limit: number = 5) {
    return this.dropsModel.paginate(
      {}, // Query
      {
        sort: { createdAt: -1 }, // 최신 순 정렬
        limit, // 개수 제한
        page // 페이지 번호
      }
    );
  }

  async findOne(_id: string) {
    const result = await this.dropsModel.findOne({ _id })
      .select({ __v: 0 });
    if (!result) {
      throw new NotFoundException('drop not found');
    }
    return result;
  }

  update(updateCreatorsDto: UpdateDropDto) {
    // update data into mongodb with mongoose
    return this.dropsModel.updateOne(
      { _id: updateCreatorsDto._id },
      updateCreatorsDto
    );
  }

  async remove(_id: string) {
    // delete data into mongodb with mongoose
    const result = await this.dropsModel.findByIdAndDelete(
      { _id }
    ).exec();

    if (!result) {
      throw new NotFoundException('drop not found');
    }

    return `removes a ${_id} drop`;
  }
}
