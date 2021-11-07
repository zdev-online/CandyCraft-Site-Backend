import { Body, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthUserRequestDto } from './dto/auth-user-request.dto';
import { CreateUserRequestDto } from './dto/create-user-request.dto';

@Controller('auth')
export class AuthController {

    async signin(@Body() dto: AuthUserRequestDto){}
    async signup(@Body() dto: CreateUserRequestDto){}
    async logout(@Req() req: Request, @Res() res: Response){}
    async refresh(@Req() req: Request, @Res() res: Response){}
}
