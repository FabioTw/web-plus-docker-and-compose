import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { WishesModule } from '../wishes/wishes.module';
import { EmailSenderModule } from '../email-sender/email-sender.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer]),
    WishesModule,
    EmailSenderModule,
    UsersModule,
  ],
  providers: [OffersService],
  controllers: [OffersController],
})
export class OffersModule {}
