import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailSubscriber, EmailSubscriberSchema } from './schemas/email-subscriber.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: EmailSubscriber.name, schema: EmailSubscriberSchema }
  ])],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
