import { IsNotEmpty, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @IsNotEmpty()
  @IsUrl()
  link: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @Length(1, 1024)
  description: string;
}
