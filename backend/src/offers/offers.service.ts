import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';
import { DeleteResult, Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { EmailSenderService } from '../email-sender/email-sender.service';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly usersService: UsersService,
    private readonly emailSenderService: EmailSenderService,
  ) {}

  private readonly relations = {
    item: { owner: true, offers: true },
    user: {
      wishes: { owner: true },
      offers: { user: true },
      wishlists: { owner: true, items: true },
    },
  };

  async createOffer(user: User, createOfferDto: CreateOfferDto) {
    const wish = await this.wishesService.findById(createOfferDto.itemId);
    if (user.id === wish.owner.id) {
      throw new BadRequestException(
        'Нельзя вносить деньги на собственные подарки',
      );
    }
    if (wish.raised + createOfferDto.amount > wish.price) {
      throw new BadRequestException(
        'Сумма собранных средств не может превышать стоимость подарка',
      );
    }
    await this.wishesService.updateById(wish.id, {
      raised: wish.raised + createOfferDto.amount,
    });
    const offer = this.offersRepository.create({
      ...createOfferDto,
      user,
      item: wish,
    });
    await this.offersRepository.save(offer);
    const updateWish = await this.wishesService.findById(createOfferDto.itemId);
    if (updateWish.raised === updateWish.price) {
      const usersWithEmails = await this.usersService.findByIdWithEmail(
        updateWish.offers.map((offer) => offer.user.id),
      );
      await this.emailSenderService.sendEmail(
        updateWish,
        usersWithEmails.map((user) => user.email),
      );
    }
    return {};
  }

  findAll(): Promise<Offer[]> {
    return this.offersRepository.find({
      relations: this.relations,
    });
  }

  findOne(id: number): Promise<Offer> {
    return this.offersRepository.findOne({
      where: { id },
      relations: this.relations,
    });
  }

  update(id: number, updateOfferDto: UpdateOfferDto): Promise<any> {
    return this.offersRepository.update(id, updateOfferDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.offersRepository.delete(id);
  }
}
