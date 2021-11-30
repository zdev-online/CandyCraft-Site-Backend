import { Controller, Get, Ip, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ConfirmedEmail } from 'src/auth/confirmed-email.decorator';
import { UserFromRequest } from 'src/users/dto/user-from-req.dto';
import { User } from 'src/users/user.decorator';
import { UnitpayCallbackDto } from './dto/unitpay-callback.dto';
import { PaymentService } from './payment.service';

@ConfirmedEmail()
@UseGuards(AuthGuard)
@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService){}

    @Get('/link/unitpay')
    async link(@User() user: UserFromRequest, @Query('sum') sum: number) {
        return await this.paymentService.createPaymentLink(user.email, 'RUB', `Покупка внутриигровой валюты на ${process.env.SITE_NAME}`, sum);
    }

    @Get('/callback/unitpay')
    async unitpayCallback(@Ip() ip: string, @Query() data: UnitpayCallbackDto){
        return await this.paymentService.unitpayCallback(ip, data);
    }
}
