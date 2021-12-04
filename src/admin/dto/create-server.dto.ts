import { IsNotEmpty, IsNumber, IsString, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServerDto {
  @ApiProperty({ examples: ['hitech', 'prefix1'] })
  @IsNotEmpty({ message: 'Префикс баз данных PEX - не может быть пустым' })
  @IsString({ message: 'Префикс баз данных PEX - не может быть пустым' })
  pex_prefix: string;

  @ApiProperty({ examples: ['Server 1', 'Server 2', 'Candy Craft - Hi-Tech'] })
  @IsNotEmpty({ message: 'Навзание сервера не может быть пустым' })
  @IsString({ message: 'Навзание сервера не может быть пустым' })
  server_name: string;

  @ApiProperty({ examples: ['Много много алмазов!!!'] })
  @IsNotEmpty({ message: 'Описание сервера не может быть пустым' })
  @IsString({ message: 'Описание сервера не может быть пустым' })
  server_desc: string;

  @ApiProperty({ examples: ['127.0.0.1', '192.168.0.1', '95.24.53.12'] })
  @IsNotEmpty({ message: 'Укажите IP сервера' })
  @IsString({ message: 'Укажите IP сервера' })
  server_ip: string;

  @ApiProperty({ examples: [5454, 6565, 8787] })
  @IsNotEmpty({ message: 'Порт - должен быть числом' })
  @Transform(({ value }) => Number(value))
  @IsNumber({ allowNaN: false }, { message: 'Порт - должен быть числом' })
  server_port: number;

  @ApiProperty({ examples: [5454, 6565, 8787] })
  @IsNotEmpty({ message: 'Порт - должен быть числом' })
  @Transform(({ value }) => Number(value))
  @IsNumber({ allowNaN: false }, { message: 'RCON-Порт - должен быть числом' })
  rcon_port: number;

  @ApiProperty({ examples: ['1.5.2', '1.12.2'] })
  @IsNotEmpty({ message: 'Версия игры - не указана' })
  @IsString({ message: 'Версия игры - должна быть строкой' })
  game_version: string;

  @ApiProperty({
    examples: [
      ['buildcraft', 'hitech'],
      ['hitech', 'industrial'],
    ],
  })
  @IsNotEmpty({
    message: 'Список модов - должны быть массивом строк',
  })
  @IsArray({ message: 'Список модов - должны быть массивом строк' })
  mods: string[];

  @ApiProperty({ examples: [1, 2, 3] })
  @IsNotEmpty({ message: 'Укажите позицию в списке серверов' })
  @Transform(({ value }) => Number(value))
  @IsNumber({ allowNaN: false }, { message: 'Позиция - должна быть числом' })
  position: number;

  @ApiProperty({ examples: ['имя_файла_с_сервера.gif'] })
  @IsNotEmpty({ message: 'Укажите GIF для обложки сервера' })
  @IsString({ message: 'Укажите GIF для обложки сервера' })
  server_gif: string;

  @ApiProperty({
    examples: [
      ['имя_файла_с_сервера1.png', 'имя_файла_с_сервера.png'],
      ['имя_файла_с_сервера.jpeg'],
    ],
  })
  @IsNotEmpty({
    message: 'Список медиа файлов - должен быть массивом названий файлов',
  })
  @IsArray({
    message: 'Список медиа файлов - должен быть массивом названий файлов',
  })
  media: string[];
}
