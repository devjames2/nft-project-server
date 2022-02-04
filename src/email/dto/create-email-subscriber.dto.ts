import { IsString, IsNotEmpty, Length, IsNumber, IsEmail, IsInt, IsBoolean, IsDate, IsOptional } from 'class-validator';

export class CreateEmailSubscriberDto {

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  emailAddress: string;

  @IsOptional()
  @IsBoolean()
  status: boolean = true;

  @IsOptional()
  @IsDate()
  createdAt: Date = new Date();
}