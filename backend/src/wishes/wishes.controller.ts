import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Patch,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { isExist } from '../utils/utils';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { WishesService } from './wishes.service';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Get('last')
  async findLast(): Promise<Wish[]> {
    const last = await this.wishesService.findLast();

    return last;
  }

  @Get('top')
  async findPopular(): Promise<Wish[]> {
    const top = await this.wishesService.findPopular();

    return top;
  }

  @UseGuards(JwtGuard)
  @Post()
  async createWihs(@Req() req, @Body() createWishDto: CreateWishDto) {
    await this.wishesService.create(req.user, createWishDto);
    return {};
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Wish> {
    const wish = await this.wishesService.findById(+id);
    isExist(wish);
    return wish;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateOne(
    @Req() req,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<void> {
    const wish = await this.wishesService.findById(+id);
    isExist(wish);
    if (wish.owner.id === req.user.id) {
      await this.wishesService.updateById(+id, updateWishDto);
      return;
    } else {
      throw new ForbiddenException();
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteOne(@Req() req, @Param('id') id: string): Promise<Wish> {
    const wish = await this.wishesService.findById(+id);
    if (wish.owner.id === req.user.id) {
      await this.wishesService.removeById(+id);
      return wish;
    } else {
      throw new ForbiddenException();
    }
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(@Req() req, @Param('id') id: string) {
    const wish = await this.wishesService.findById(+id);
    await this.wishesService.updateById(wish.id, {
      copied: ++wish.copied,
    });
    if (wish.owner.id !== req.user.id) {
      const { name, link, image, price, description } = wish;
      await this.wishesService.create(req.user, {
        name,
        link,
        image,
        price,
        description,
      });
    }
    return {};
  }
}
