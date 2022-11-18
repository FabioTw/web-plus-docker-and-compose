import { IsOptional, IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @IsOptional()
  @Length(1, 250)
  name?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  itemsId?: number[];
}
