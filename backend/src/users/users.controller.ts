import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  Req,
  Param,
  Post,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { isExist } from '../utils/utils';
import { Wish } from '../wishes/entities/wish.entity';
import { WishesService } from '../wishes/wishes.service';
import { FindUsersDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('me')
  findMe(@Req() req): Promise<User> {
    return this.usersService.findById(req.user.id, { withEmail: true });
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateMe(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.usersService.findById(req.user.id, {
      withEmail: true,
    });

    isExist(user);

    updateUserDto.password
      ? await this.usersService.updateWithPassword(req.user.id, updateUserDto)
      : await this.usersService.updateById(user.id, updateUserDto);

    return user;
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  findMyWishes(@Req() req): Promise<Wish[]> {
    return this.wishesService.findByUserId(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post('find')
  findQuery(@Body() findUsersDto: FindUsersDto): Promise<User[]> {
    return this.usersService.findByQuery(findUsersDto);
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  async findUserByName(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);
    isExist(user);
    return user;
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  async findUserWishes(@Param('username') username: string): Promise<Wish[]> {
    const user = await this.usersService.findByUsername(username);
    const id = user.id;
    const options = {
      where: {
        owner: {
          id,
        },
      },
      relations: {
        offers: {
          item: { owner: true },
          user: {
            wishes: { owner: true },
            offers: true,
            wishlists: { owner: true, items: true },
          },
        },
      },
    };
    return this.wishesService.find(options);
  }
}
