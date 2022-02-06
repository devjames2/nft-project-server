import { IsArray, IsBase64, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

export enum PaymentUnit {
    ETH = 'ETH',
    LBL_BEP20 = 'LBL_BEP20',
    LBE_ERC20 = 'LBE_ERC20'
}

export class DropNFTDto {
    @IsNotEmpty()
    @IsString()
    @Length(42, 42)
    tokenAddress: string;
  
    @IsNotEmpty()
    @IsString()
    tokenId: string;

    @IsNotEmpty()
    @IsEnum(PaymentUnit)
    unit: PaymentUnit;

    @IsNotEmpty()
    @IsNumber()
    value: number;

    @IsNotEmpty()
    @IsNumber()
    volume: number;

}
