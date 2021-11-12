import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ConfirmedEmail } from 'src/auth/confirmed-email.decorator';
import { UserFromRequest } from 'src/users/dto/user-from-req.dto';
import { User } from 'src/users/user.decorator';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
    constructor(private shopService: ShopService){}
    @ConfirmedEmail()
    @UseGuards(AuthGuard)
    @Post('/buy')
    async buy(@User() user: UserFromRequest, @Body('product_id') product_id: string){
        return this.shopService.buy(user, Number(product_id)); 
    }

    @Get('/')
    async findAll(@Query('order_by') order_by: string){
        return this.shopService.findAll(Number(order_by)); 
    }

    @Get('/:id')
    async find(@Param('id') id:string){
        return this.shopService.find(Number(id)); 
    }
}
