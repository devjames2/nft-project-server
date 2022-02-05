import { HttpException, Injectable, Next, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { Users, UsersDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private readonly usersModel: PaginateModel<UsersDocument>,
    private readonly jwtService: JwtService) { }

    async create(createUsersDto: CreateUsersDto) {
      // insert data into mongodb with mongoose
      const usersExist = await this.checkUsersExists(createUsersDto.accountAddress);
      if (usersExist) {
        throw new UnprocessableEntityException('accountAddress already exists');
      }
      const newUsers = new this.usersModel(createUsersDto);
      return newUsers.save();
    }
  
    private async checkUsersExists(accountAddress: string): Promise<boolean> {
      const users = await this.usersModel.findOne({ accountAddress });
      if (users) {
        return true;
      }
      return false;
    }
  
    // Retieve userss with pagination
    findAll(page: number = 1, limit: number = 5) {
      return this.usersModel.paginate(
        {}, // Query
        {
          sort: { createdAt: -1 }, // 최신 순 정렬
          limit, // 개수 제한
          page // 페이지 번호
        }
      );
    }
  
    update(updateUsersDto: UpdateUsersDto) {
      // update data into mongodb with mongoose
      return this.usersModel.updateOne(
        { accountAddress: updateUsersDto.accountAddress },
        updateUsersDto
      );
    }
  
    remove(createUsersDto: CreateUsersDto) {
      // delete data into mongodb with mongoose
      return this.usersModel.deleteOne(
        { accountAddress: createUsersDto.accountAddress }
        );
    }
}

