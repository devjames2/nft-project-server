import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUsersDto } from './create-users.dto';

export class UpdateUsersDto extends PartialType(CreateUsersDto) {
    @IsNotEmpty()
    @IsString()
    _id:string;
}
