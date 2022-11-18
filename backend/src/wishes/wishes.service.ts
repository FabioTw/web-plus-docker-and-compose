import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { isExist } from '../utils/utils';
import { DeleteResult, FindManyOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  private readonly relations = {
    owner: true,
    offers: {
      item: true,
      user: {
        wishes: true,
        offers: true,
        wishlists: { owner: true, items: true },
      },
    },
  };

  async create(user: User, createWishDto: CreateWishDto): Promise<Wish> {
    const wish = await this.wishRepository.save({
      ...createWishDto,
      owner: user,
    });
    return wish;
  }

  async findById(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      relations: this.relations,
      where: { id },
    });
    isExist(wish);
    return wish;
  }

  updateById(id: number, updateWishDto: UpdateWishDto): Promise<any> {
    return this.wishRepository.update({ id }, updateWishDto);
  }

  removeById(id: number): Promise<DeleteResult> {
    return this.wishRepository.delete({ id });
  }

  findLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      relations: this.relations,
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }

  findPopular(): Promise<Wish[]> {
    return this.wishRepository.find({
      relations: this.relations,
      order: {
        copied: 'DESC',
      },
      take: 20,
    });
  }

  findByUserId(id: number): Promise<Wish[]> {
    return this.wishRepository.find({
      where: {
        owner: {
          id,
        },
      },
      relations: this.relations,
    });
  }

  async find(options: FindManyOptions<Wish>): Promise<Wish[]> {
    return this.wishRepository.find(options);
  }
}
