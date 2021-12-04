import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDto {
  @ApiProperty({ examples: ['test@gmail.com', 'mail@yandex.ru'] })
  @IsNotEmpty({ message: 'Некорректный E-Mail ' })
  @IsString({ message: 'Некорректный E-Mail' })
  @IsEmail({}, { message: 'Некорректный E-Mail' })
  email: string;

  @ApiProperty({ examples: ['Zabivnoy228', 'Kaspiskaya69'] })
  @IsNotEmpty({ message: 'Укажите никнейм' })
  @IsString({ message: 'Укажите никнейм' })
  username: string;

  @ApiProperty({ examples: ['super_puper_pass', 'MY@aPAs@awfq@'] })
  @IsNotEmpty({ message: 'Укажите пароль' })
  @IsString({ message: 'Укажите пароль' })
  @MinLength(8, { message: 'Минимальная длина пароля 8 символов' })
  @MaxLength(32, { message: 'Максимальная длина пароля 32 символа' })
  password: string;

  @ApiProperty({ examples: ['super_puper_pass', 'MY@aPAs@awfq@'] })
  @IsNotEmpty({ message: 'Подтвердите пароль' })
  @IsString({ message: 'Подтвердите пароль' })
  password_confirm: string;

  @ApiProperty({ example: 'ТОКЕН_ОТ_ГУГЛ_КАПЧИ' })
  @IsNotEmpty({ message: 'Неверная капча' })
  @IsString({ message: 'Неверный капча' })
  captcha_token: string;

  @ApiProperty({ examples: [true, false] })
  @IsNotEmpty({ message: 'Вы не подтвердили соглашение' })
  @IsBoolean({ message: 'Вы не подтвердили соглашение' })
  agreement: boolean;
}
