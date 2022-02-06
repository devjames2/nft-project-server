import { IsString, IsNotEmpty, Length, IsOptional, IsDate, IsEthereumAddress } from 'class-validator';
import { uniqueNamesGenerator, adjectives, colors, animals, NumberDictionary } from 'unique-names-generator';


export class CreateUsersDto {
  @IsNotEmpty()
  @IsEthereumAddress()
  @Length(42, 42)
  accountAddress: string;

  @IsOptional()
  @IsString()
  nickName: string = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals, NumberDictionary.generate({ min: 1, max: 999999})]
  });

  @IsOptional()
  @IsDate()
  createdAt: Date = new Date();
}