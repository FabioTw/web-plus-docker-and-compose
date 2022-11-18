import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(
    user: User,
    createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const wishes = await this.wishesService.find({
      where: { id: In(createWishlistDto.itemsId || []) },
    });
    const wishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      owner: user,
      items: wishes,
    });
    return this.wishlistsRepository.save(wishlist);
  }

  findAll(): Promise<Wishlist[]> {
    return this.wishlistsRepository.find({ relations: ['owner', 'items'] });
  }

  findOne(id: number): Promise<Wishlist> {
    return this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto): Promise<any> {
    return await this.wishlistsRepository.update(id, updateWishlistDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.wishlistsRepository.delete(id);
  }
}
