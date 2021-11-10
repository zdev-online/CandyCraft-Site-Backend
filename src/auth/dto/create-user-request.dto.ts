import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserRequestDto {
  @IsNotEmpty({ message: 'Некорректный E-Mail ' })
  @IsString({ message: 'Некорректный E-Mail' })
  @IsEmail({}, { message: 'Некорректный E-Mail' })
  email: string;

  @IsNotEmpty({ message: 'Укажите никнейм' })
  @IsString({ message: 'Укажите никнейм' })
  username: string;

  @IsNotEmpty({ message: 'Укажите пароль' })
  @IsString({ message: 'Укажите пароль' })
  @MinLength(8, { message: 'Минимальная длина пароля 8 символов' })
  @MaxLength(32, { message: 'Максимальная длина пароля 32 символа' })
  password: string;

  @IsNotEmpty({ message: 'Подтвердите пароль' })
  @IsString({ message: 'Подтвердите пароль' })
  password_confirm: string;

  @IsNotEmpty({ message: 'Неверная капча' })
  @IsString({ message: 'Неверный капча' })
  captcha_token: string;

  @IsNotEmpty({ message: 'Вы не подтвердили соглашение' })
  @IsBoolean({ message: 'Вы не подтвердили соглашение' })
  agreement: boolean;
}
