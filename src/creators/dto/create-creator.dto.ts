import { IsString, IsNotEmpty, Length, IsOptional, IsDate, IsBase64, IsUrl, IsEnum } from 'class-validator';

export enum CreatorStatus {
    HIDE,
    DROPS_FINISHED,
    NOT_SCHEDULED,
    ON_SALE,
    REGISTERING
}

export class CreateCreatorDto {
    @IsNotEmpty()
    @IsString()
    @Length(42, 42)
    accountAddress: string;
  
    @IsNotEmpty()
    @IsString()
    nickName: string;

    @IsOptional()
    @IsEnum(CreatorStatus)
    status: CreatorStatus = CreatorStatus.HIDE;

    @IsNotEmpty()
    @IsString()
    shortDescription: string;
  
    @IsNotEmpty()
    @IsString()
    longDescription: string;

    @IsNotEmpty()
    @IsBase64()
    profileThumbnail: string;

    @IsNotEmpty()
    @IsBase64()
    backwallThumbnail: string;

    @IsNotEmpty()
    @IsBase64()
    mainBannerThumbnailPC: string;

    @IsNotEmpty()
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
