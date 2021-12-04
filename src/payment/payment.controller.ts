import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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
import { TopcraftCallbackDto } from './dto/topcraft-callback.dto';
import { UnitpayCallbackDto } from './dto/unitpay-callback.dto';
import { PaymentService } from './payment.service';

@ApiTags('candy-craft')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) { }

  @ApiBearerAuth('JWT_AUTH')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Получить ссылку на пополнение баланса через Unitpay', summary: 'Получить ссылку на пополнение баланса через Unitpay' })
  @ApiOkResponse({ type: String })
  @ConfirmedEmail()
  @UseGuards(AuthGuard)
  @Get('/link/unitpay')
  async link(@User() user: UserFromRequest, @Query('sum') sum: number): Promise<string> {
    return await this.paymentService.createPaymentLink(
      user.email,
      'RUB',
      `Покупка внутриигровой валюты на ${process.env.SITE_NAME}`,
      sum,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('/callback/unitpay')
  async unitpayCallback(@Ip() ip: string, @Query() data: UnitpayCallbackDto) {
    return await this.paymentService.unitpayCallback(ip, data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/callback/topcraft')
  async topcraftCallback(@Body() data: TopcraftCallbackDto) {
    return await this.paymentService.topcraftCallback(data);
  }
}
