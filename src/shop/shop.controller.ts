import { Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { ConfirmedEmail } from 'src/auth/confirmed-email.decorator';
import { UserFromRequest } from 'src/users/dto/user-from-req.dto';
import { User } from 'src/users/user.decorator';
import { BuyProductResponseDto } from './dto/buy-product-reponse.dto';
import { FindAllProductsDto } from './dto/find-all-products.dto';
import { ShopService } from './shop.service';

@ApiTags('candy-craft')
@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Получить все товары', summary: 'Получить все товары' })
  @ApiOkResponse({ type: FindAllProductsDto })
  @Get('/')
  async findAll() {
    return await this.shopService.findAll();
  }

  @ApiBearerAuth('JWT_AUTH')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Купить товар', summary: 'Купить товар' })
  @ApiOkResponse({ type: BuyProductResponseDto })
  @ConfirmedEmail()
  @UseGuards(AuthGuard)
  @Post('/buy/:id')
  async buy(
    @Param('id') id: number,
    @Query('server') serverId: number,
    @User() user: UserFromRequest,
  ) {
    return await this.shopService.buy(id, serverId, user);
  }
}
