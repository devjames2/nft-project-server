import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUsersDto: CreateUsersDto) {
    return this.usersService.create(createUsersDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.usersService.findAll(page, limit);
  }

  @Patch()
  update(@Body() updateUsersDto: UpdateUsersDto) {
    return this.usersService.update(updateUsersDto);
  }

  @Delete()
  remove(@Body() createUsersDto: CreateUsersDto) {
    return this.usersService.remove(createUsersDto);
  }


}
