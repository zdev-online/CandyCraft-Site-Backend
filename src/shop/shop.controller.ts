import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ConfirmedEmail } from 'src/auth/confirmed-email.decorator';
import { UserFromRequest } from 'src/users/dto/user-from-req.dto';
import { User } from 'src/users/user.decorator';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) {}

  @Get('/')
  async findAll() {
    return await this.shopService.findAll();
  }

  @ConfirmedEmail()
  @UseGuards(AuthGuard)
  @Post('/buy/:id')
  async buy(@Param('id') id: string, @User() user: UserFromRequest) {
    return await this.shopService.buy(Number(id), user);
  }
}
