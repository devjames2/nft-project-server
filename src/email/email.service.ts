import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { CreateEmailSubscriberDto } from './dto/create-email-subscriber.dto';
import { UpdateEmailDto } from './dto/update-email-subscriber.dto';
import { EmailSubscriberDocument } from './schemas/email-subscriber.schema';

@Injectable()
export class EmailService {
  constructor(
    @InjectModel('EmailSubscriber')
    private readonly emailSubscriberModel: PaginateModel<EmailSubscriberDocument>
  ) { }

  async create(createEmailDto: CreateEmailSubscriberDto) {
    // insert data into mongodb with mongoose

    const subscriberExist = await this.checkSubscriberExists(createEmailDto.emailAddress);
    if (subscriberExist) {
      throw new UnprocessableEntityException('Email already exists');
    }
    const newEmailSubscriber = new this.emailSubscriberModel(createEmailDto);
    return newEmailSubscriber.save();
  }

  private async checkSubscriberExists(emailAddress: string): Promise<boolean> {
    const subscriber = await this.emailSubscriberModel.findOne({ emailAddress })
                                                      .select({ __v: 0 });;
    if (subscriber) {
      return true;
    }
    return false;
  }

  // Retieve email subscribers with pagination
  findAll(page: number = 1, limit: number = 5) {
    return this.emailSubscriberModel.paginate(
      {}, // Query
      {
        sort: { createdAt: -1 }, // 최신 순 정렬
        limit, // 개수 제한
        page // 페이지 번호
      }
    );
  }

  update(updateEmailDto: UpdateEmailDto) {
    // update data into mongodb with mongoose
    return this.emailSubscriberModel.updateOne(
      { emailAddress: updateEmailDto.emailAddress },
      updateEmailDto
    ).select({__v: 0});
  }

  remove(createEmailDto: CreateEmailSubscriberDto) {
    // delete data into mongodb with mongoose
    return this.emailSubscriberModel.deleteOne(
      { emailAddress: createEmailDto.emailAddress }
    ).select({__v: 0});
  }
}
