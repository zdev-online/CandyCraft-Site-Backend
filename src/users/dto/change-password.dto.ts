import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ examples: ['my_old_pass'] })
  @IsNotEmpty({ message: 'Вы не указали старый пароль' })
  @IsString({ message: 'Вы не указали старый пароль' })
  old_password: string;

  @ApiProperty({ examples: ['my_new_pass'] })
  @IsNotEmpty({ message: 'Вы не указали новый пароль' })
  @IsString({ message: 'Вы не указали новый пароль' })
  @MinLength(8, { message: 'Минимальная длина пароля 8 символов' })
  @MaxLength(32, { message: 'Максимальная длина пароля 32 символа' })
  new_password: string;

  @ApiProperty({ examples: ['my_new_pass'] })
  @IsNotEmpty({ message: 'Пароли не совпадают' })
  @IsString({ message: 'Пароли не совпадают' })
  new_password_confirm: string;
}
