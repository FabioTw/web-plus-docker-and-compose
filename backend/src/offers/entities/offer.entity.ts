import { Entity, Column, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsOptional, NotEquals } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { CommonEntityFields } from '../../types/common-entity-fields';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Offer extends CommonEntityFields {
  @ManyToOne(() => User, (user) => user.offers)
  @IsNotEmpty()
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  @IsNotEmpty()
  item: Wish;

  @Column({ scale: 2, type: 'decimal' })
  @IsNotEmpty()
  @NotEquals(0)
  amount: number;

  @Column({ default: false })
  @IsOptional()
  hidden: boolean;
}
