import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Offer } from './offers/entities/offer.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { AuthModule } from './auth/auth.module';
import { EmailSenderModule } from './email-sender/email-sender.module';
import { ConfigModule } from '@nestjs/config';
import constants from './constants/constants';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: constants().db.host,
      port: constants().db.port,
      username: constants().db.username,
      password: constants().db.password,
      database: constants().db.databaseName,
      entities: [User, Wish, Offer, Wishlist],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      load: [constants],
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
    EmailSenderModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
