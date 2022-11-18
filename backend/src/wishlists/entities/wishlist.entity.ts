import { Entity, Column, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { Length, IsUrl, IsOptional, IsNotEmpty } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { CommonEntityFields } from 'src/types/common-entity-fields';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Wishlist extends CommonEntityFields {
  @Column()
  @Length(1, 250)
  name: string;

  @Column({ default: 'Ещё нет описания' })
  @Length(1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  @IsOptional()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  @IsNotEmpty()
  owner: User;
}
