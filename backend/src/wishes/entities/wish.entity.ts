import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import {
  Length,
  IsUrl,
  IsInt,
  IsNotEmpty,
  Min,
  IsOptional,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { CommonEntityFields } from 'src/types/common-entity-fields';

@Entity()
export class Wish extends CommonEntityFields {
  @Column()
  @IsNotEmpty()
  @Length(1, 250)
  name: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  link: string;

  @Column()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @Column({
    scale: 2,
    type: 'decimal',
    transformer: {
      to: (value: number) => value,
      from: (value: string): number => parseFloat(value),
    },
  })
  @IsNotEmpty()
  price: number;

  @Column({
    scale: 2,
    type: 'decimal',
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string): number => parseFloat(value),
    },
  })
  @IsOptional()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @JoinColumn()
  @IsNotEmpty()
  owner: User;

  @Column()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  @IsInt()
  @Min(0)
  copied: number;
}
