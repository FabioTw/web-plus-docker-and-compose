import {
  Controller,
  UseGuards,
  Post,
  Req,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { isExist } from '../utils/utils';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';

@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    return this.offersService.createOffer(req.user, createOfferDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Offer> {
    const offer = await this.offersService.findOne(+id);
    isExist(offer);
    return offer;
  }
}
