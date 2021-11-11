import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthUserRequestDto } from './dto/auth-user-request.dto';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { AuthService } from 'src/auth/auth.service';
import { EndRestoreDto } from './dto/end-restore.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  async signin(
    @Body() dto: AuthUserRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.signin(dto);
    res.cookie('Refresh-Token', data.refresh_token, {
      path: '/auth',
      httpOnly: true,
      expires: new Date(
        new Date().getTime() +
          1000 *
            60 *
            60 *
            24 *
            parseInt(process.env.JWT_REFRESH_EXPIRES.replace('d', '')),
      ),
    });
    return data;
  }

  @Post('/signup')
  async signup(
    @Body() dto: CreateUserRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.signup(dto);
    res.cookie('Refresh-Token', data.refresh_token, {
      path: '/auth',
      httpOnly: true,
      expires: new Date(
        new Date().getTime() +
          1000 *
            60 *
            60 *
            24 *
            parseInt(process.env.JWT_REFRESH_EXPIRES.replace('d', '')),
      ),
    });
    return data;
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refresh_token = req.cookies['Refresh-Token'];
    await this.authService.logout(refresh_token);
    res.clearCookie('Refresh-Token');
    return { message: 'Успешный выход' };
  }

  @Post('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refresh_token = req.cookies['Refresh-Token'];
    let data = await this.authService.refresh(refresh_token);
    return data;
  }

  @Post('/confirm/email')
  async confirmEmail(@Body('token') token: string) {
    let data = await this.authService.confirmEmail(token);
    return data;
  }

  @Get('/restore')
  async startRestorePassword(@Query('email') email: string){
    return this.authService.startRestorePassword(email);
  }

  @Post('/restore')
  async endRestorePassword(@Body() endRestoreDto: EndRestoreDto) {
    return this.authService.endRestorePassword(endRestoreDto);
  }
}
