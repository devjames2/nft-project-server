import { IsString, IsNotEmpty, Length, IsOptional, IsDate, IsBase64, IsUrl, IsEnum, IsEthereumAddress } from 'class-validator';

export enum CreatorStatus {
    HIDE = 'HIDE',
    DROPS_FINISHED = 'DROPS_FINISHED',
    NOT_SCHEDULED = 'NOT_SCHEDULED',
    ON_SALE = 'ON_SALE',
    REGISTERING = 'REGISTERING'
}

export class CreateCreatorDto {
    @IsNotEmpty()
    @IsEthereumAddress()
    @Length(42, 42)
    accountAddress: string;
  
    @IsNotEmpty()
    @IsString()
    nickName: string;

    @IsOptional()
    @IsEnum(CreatorStatus)
    status: CreatorStatus = CreatorStatus.HIDE;

    @IsOptional()
    @IsString()
    shortDescription: string;
  
    @IsOptional()
    @IsString()
    longDescription: string;

    @IsOptional()
    @IsBase64()
    profileThumbnail: string;

    @IsOptional()
    @IsBase64()
    backwallThumbnail: string;

    @IsOptional()
    @IsBase64()
    mainBannerThumbnailPC: string;

    @IsOptional()
    @IsBase64()
    mainBannerThumbnailMobile: string;

    @IsOptional()
    @IsUrl()
    instagram: string;

    @IsOptional()
    @IsUrl()
    twitter: string;

    @IsOptional()
    @IsUrl()
    tiktok: string;

    @IsOptional()
    @IsUrl()
    homepage: string;

    @IsOptional()
    @IsDate()
    createdAt: Date = new Date();
}
