import { PartialType } from '@nestjs/swagger';
import { DropNFTDto } from './drop-nft.dto';

export class UpdateDropNFTDto extends PartialType(DropNFTDto) {}
