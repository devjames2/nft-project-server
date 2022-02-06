import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DropsService } from './drops.service';
import { CreateDropDto } from './dto/create-drop.dto';
import { UpdateDropDto } from './dto/update-drop.dto';

@Controller('drops')
export class DropsController {
  constructor(private readonly dropsService: DropsService) {}

  @Post()
  create(@Body() createDropDto: CreateDropDto) {
    return this.dropsService.create(createDropDto);
  }

  @Get()
  findAll() {
    return this.dropsService.findAll();
  }

  @Get(':_id')
  findOne(@Param('_id') _id: string) {
    return this.dropsService.findOne(_id);
  }

  @Patch()
  update(@Body() updateDropDto: UpdateDropDto) {
    return this.dropsService.update(updateDropDto);
  }

  @Delete(':_id')
  remove(@Param('_id') _id: string) {
    return this.dropsService.remove(_id);
  }
}
