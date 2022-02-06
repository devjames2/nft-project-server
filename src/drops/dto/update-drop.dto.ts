import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateDropDto } from './create-drop.dto';

export class UpdateDropDto extends PartialType(CreateDropDto) {
    @IsNotEmpty()
    @IsString()
    _id:string;
}
