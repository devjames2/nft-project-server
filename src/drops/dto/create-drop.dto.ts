import { Type } from "class-transformer";
import { IsArray, IsBase64, IsDate, IsEnum, IsEthereumAddress, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { DropNFTDto } from "./drop-nft.dto";

export enum DropStatus {
    REGISTERING = 'REGISTERING',
    ON_AUCTION = 'ON_AUCTION',
    ON_SALE = 'ON_SALE',
    DROPS_FINISHED = 'DROPS_FINISHED',
    NOT_SCHEDULED = 'NOT_SCHEDULED'
}

export enum DropSalesType {
    FIXED_PRICE = 'FIXED_PRICE',
    ON_AUCTION = 'ON_AUCTION'
}

export class CreateDropDto {
    @IsNotEmpty()
    @IsString()
    dropName: string;

    @IsOptional()
    @IsEnum(DropStatus)
    status: DropStatus = DropStatus.REGISTERING;

    @IsNotEmpty()
    @IsEnum(DropSalesType)
    dropSalesType: DropSalesType;

    @IsOptional()
    @IsString()
    shortDescription: string;
  
    @IsOptional()
    @IsString()
    longDescription: string;

    @IsOptional()
    @IsBase64()
    mainThumbnail: string;

    @IsOptional()
    @IsBase64()
    mainBannerThumbnailPC: string;

    @IsOptional()
    @IsBase64()
    mainBannerThumbnailMobile: string;

    @IsArray()
    @IsOptional()
    dropNFTs: DropNFTDto[];

    @IsArray()
    @IsOptional()
    creators: string[];

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dropStartDate: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dropEndDate: Date;

    @IsOptional()
    @IsString()
    timezone: string = 'UTC';

    @IsOptional()
    @IsDate()
    createdAt: Date = new Date();
}
