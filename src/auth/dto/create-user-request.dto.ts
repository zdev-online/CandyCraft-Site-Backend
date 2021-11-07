import { IsString, MinLength, MaxLength, IsEmail, IsBoolean } from "class-validator";

export class CreateUserRequestDto {

  @IsEmail({}, { message: 'Некорректный E-Mail' })
  email: string;

  @IsString({ message: 'Никенейм - должен быть строкой' })
  username: string;

  @IsString({ message: 'Пароль - должен быть строкой' })
  @MinLength(8, { message: 'Минимальная длина пароля 8 символов' })
  @MaxLength(32, { message: 'Максимальная длина пароля 32 символа' })
  password: string;

  password_confirm: string;
  
  @IsString({ message: 'Неверный токен капчи' })
  captcha_token: string;

  @IsBoolean({ message: 'Поле соглашения - должно быть логическим' })
  agreement: boolean;
}
