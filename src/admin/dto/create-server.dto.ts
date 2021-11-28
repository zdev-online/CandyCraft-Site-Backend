import { IsNotEmpty, IsNumber, IsString, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateServerDto {
  @IsNotEmpty({ message: 'Префикс баз данных PEX - не может быть пустым' })
  @IsString({ message: 'Префикс баз данных PEX - не может быть пустым' })
  pex_prefix: string;

  @IsNotEmpty({ message: 'Навзание сервера не может быть пустым' })
  @IsString({ message: 'Навзание сервера не может быть пустым' })
  server_name: string;

  @IsNotEmpty({ message: 'Описание сервера не может быть пустым' })
  @IsString({ message: 'Описание сервера не может быть пустым' })
  server_desc: string;

  @IsNotEmpty({ message: 'Укажите IP сервера' })
  @IsString({ message: 'Укажите IP сервера' })
  server_ip: string;

  @IsNotEmpty({ message: 'Порт - должен быть числом' })
  @Transform(({ value }) => Number(value))
  @IsNumber({ allowNaN: false }, { message: 'Порт - должен быть числом' })
  server_port: number;

  @IsNotEmpty({ message: 'Порт - должен быть числом' })
  @Transform(({ value }) => Number(value))
  @IsNumber({ allowNaN: false }, { message: 'RCON-Порт - должен быть числом' })
  rcon_port: number;

  @IsNotEmpty({ message: 'Версия игры - не указана' })
  @IsString({ message: 'Версия игры - должна быть строкой' })
  game_version: string;

  @IsNotEmpty({
    message:
      'Список модов - должны быть массивом, который объеденен в строку через запятую',
  })
  @Transform(({ value }) => String(value).split(','))
  @IsArray({ message: 'Список модов - должны быть массивом строк' })
  mods: string[];

  @IsNotEmpty({ message: 'Укажите позицию в списке серверов' })
  @Transform(({ value }) => Number(value))
  @IsNumber({ allowNaN: false }, { message: 'Позиция - должна быть числом' })
  position: number;
}
