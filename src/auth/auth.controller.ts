import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthUserRequestDto } from './dto/auth-user-request.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiHeaders,
  ApiHeader,
} from '@nestjs/swagger';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { AuthService } from 'src/auth/auth.service';
import { EndRestoreDto } from './dto/end-restore.dto';
import { SignInResponseDto } from './dto/signin-response.dto';
import { SignUpResponseDto } from './dto/signup-response.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { ConfirmEmailResponseDto } from './dto/confirm-email-response.dto';
import { AuthGuard } from './auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Авторизация', summary: 'Авторизация' })
  @ApiOkResponse({ type: SignInResponseDto })
  @Post('/signin')
  async signin(
    @Body() dto: AuthUserRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInResponseDto> {
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

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Регистрация', summary: 'Регистрация' })
  @ApiOkResponse({ type: SignUpResponseDto })
  @Post('/signup')
  async signup(
    @Body() dto: CreateUserRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignUpResponseDto> {
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

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT_AUTH')
  @ApiOperation({
    description: 'Выход из системы',
    summary: 'Выход из системы',
  })
  @ApiOkResponse({ type: MessageResponseDto })
  @Post('/logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<MessageResponseDto> {
    const refresh_token = req.cookies['Refresh-Token'];
    await this.authService.logout(refresh_token);
    res.clearCookie('Refresh-Token');
    return { message: 'Успешный выход' };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT_AUTH')
  @ApiOperation({
    description: 'Обновление Access и Refresh токенов',
    summary: 'Обновление Access и Refresh токенов',
  })
  @ApiHeader({ 
    name: 'Refresh-Token',
    required: true
  })
  @ApiOkResponse({ type: RefreshResponseDto })
  @Post('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResponseDto> {
    const refresh_token = req.cookies['Refresh-Token'];
    let data = await this.authService.refresh(refresh_token);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT_AUTH')
  @ApiOperation({
    description: 'Подтверждение E-Mail',
    summary: 'Подтверждение E-Mail',
  })
  @ApiOkResponse({ type: ConfirmEmailResponseDto })
  @Post('/confirm/email')
  async confirmEmail(
    @Body('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ConfirmEmailResponseDto> {
    let data = await this.authService.confirmEmail(token);
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

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Начать обновление пароля',
    summary: 'Начать обновление пароля',
  })
  @ApiOkResponse({ type: MessageResponseDto })
  @Get('/restore')
  async startRestorePassword(
    @Query('email') email: string,
  ): Promise<MessageResponseDto> {
    return await this.authService.startRestorePassword(email);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Завершить обновление пароля',
    summary: 'Завершить обновление пароля',
  })
  @ApiOkResponse({ type: MessageResponseDto })
  @Post('/restore')
  async endRestorePassword(
    @Body() endRestoreDto: EndRestoreDto,
  ): Promise<MessageResponseDto> {
    return await this.authService.endRestorePassword(endRestoreDto);
  }
}
