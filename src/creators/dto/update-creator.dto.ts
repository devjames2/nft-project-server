import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateCreatorDto } from './create-creator.dto';

export class UpdateCreatorDto extends PartialType(CreateCreatorDto) {
    @IsNotEmpty()
    @IsString()
    _id:string;
}
