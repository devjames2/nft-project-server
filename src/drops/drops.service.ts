import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { CreateDropDto, DropStatus } from './dto/create-drop.dto';
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

  async update(updateCreatorsDto: UpdateDropDto) {
    if (await this.checkDropCanBeModified(updateCreatorsDto._id) === false) {
      throw new UnprocessableEntityException('Drop can be modified only when status is registering or not scheduled');
    }

    // update data into mongodb with mongoose
    return this.dropsModel.updateOne(
      { _id: updateCreatorsDto._id },
      updateCreatorsDto
    );
  }

  async remove(_id: string) {
    if (await this.dropsModel.findById({ _id }) === null) {
      throw new NotFoundException('drop not found');
    }

    if (await this.checkDropCanBeModified(_id) === false) {
      throw new UnprocessableEntityException('Drop can be modified only when status is registering or not scheduled');
    }

    this.dropsModel.findById(_id);
    // delete data into mongodb with mongoose
    const result = await this.dropsModel.findByIdAndDelete(
      { _id }
    ).exec();

    Logger.debug(result);
    return `removes a ${_id} drop`;
  }

  private async checkDropExists(dropName: string): Promise<boolean> {
    const drop = await this.dropsModel.findOne({ dropName });
    if (drop) {
      return true;
    }
    return false;
  }

  private async checkDropCanBeModified(_id: string): Promise<boolean> {
    const dropStatus = await this.dropsModel.findOne({ _id }).select({ status: 1 });
    if (dropStatus.status === DropStatus.REGISTERING || dropStatus.status === DropStatus.NOT_SCHEDULED) {
      return true;
    }
    return false;
  }

}
