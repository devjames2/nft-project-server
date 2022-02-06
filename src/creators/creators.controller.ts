import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreatorsService } from './creators.service';
import { CreateCreatorDto } from './dto/create-creator.dto';
import { UpdateCreatorDto } from './dto/update-creator.dto';

@Controller('creators')
export class CreatorsController {
  constructor(private readonly creatorsService: CreatorsService) {}

  @Post()
  create(@Body() createCreatorDto: CreateCreatorDto) {
    return this.creatorsService.create(createCreatorDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.creatorsService.findAll();
  }

  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.creatorsService.findOne(_id);
  }

  @Patch()
  update(@Body() updateCreatorDto: UpdateCreatorDto) {
    return this.creatorsService.update(updateCreatorDto);
  }

  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.creatorsService.remove(_id);
  }
}
