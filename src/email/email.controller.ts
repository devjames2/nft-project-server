import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailSubscriberDto } from './dto/create-email-subscriber.dto';
import { UpdateEmailDto } from './dto/update-email-subscriber.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  create(@Body() createEmailDto: CreateEmailSubscriberDto) {
    return this.emailService.create(createEmailDto);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.emailService.findAll(page, limit);
  }

  @Patch()
  update(@Body() updateEmailDto: UpdateEmailDto) {
    return this.emailService.update(updateEmailDto);
  }

  @Delete(':emailAddress')
  remove(@Param('emailAddress') emailAddress: string) {
    return this.emailService.remove(emailAddress);
  }
}
