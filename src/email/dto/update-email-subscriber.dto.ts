import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateEmailSubscriberDto } from './create-email-subscriber.dto';

export class UpdateEmailDto extends PartialType(CreateEmailSubscriberDto) {
    @IsNotEmpty()
    @IsString()
    _id:string;
}
