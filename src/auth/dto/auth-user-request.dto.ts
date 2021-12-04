import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthUserRequestDto {
  @ApiProperty({ examples: ['test@gmail.com', 'mail@yandex.ru'] })
  @IsEmail({}, { message: 'Некорректный E-Mail' })
  email: string;

  @ApiProperty({ examples: ['my_secret_password', 'very_very_strong_pass'] })
  @IsString({ message: 'Пароль - должен быть строкой' })
  @MinLength(8, { message: 'Минимальная длина пароля 8 символов' })
  @MaxLength(32, { message: 'Максимальная длина пароля 32 символа' })
  password: string;
}
