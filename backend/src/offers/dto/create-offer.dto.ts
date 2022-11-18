import { IsNotEmpty, IsOptional, NotEquals } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @NotEquals(0)
  amount: number;

  @IsOptional()
  hidden?: boolean;

  @IsNotEmpty()
  itemId: number;
}
