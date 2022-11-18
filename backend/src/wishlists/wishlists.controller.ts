import {
  Controller,
  UseGuards,
  Post,
  Req,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { isExist } from '../utils/utils';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Req() req,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(req.user, createWishlistDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Wishlist> {
    const wishlist = await this.wishlistsService.findOne(+id);
    isExist(wishlist);
    return wishlist;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<void> {
    const wishlist = await this.wishlistsService.findOne(+id);
    isExist(wishlist);
    if (wishlist.owner.id === req.user.id) {
      await this.wishlistsService.update(+id, updateWishlistDto);
      return;
    } else {
      throw new ForbiddenException();
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string): Promise<Wishlist> {
    const wishlist = await this.wishlistsService.findOne(+id);
    isExist(wishlist);
    if (wishlist.owner.id === req.user.id) {
      await this.wishlistsService.remove(+id);
      return wishlist;
    } else {
      throw new ForbiddenException();
    }
  }
}
