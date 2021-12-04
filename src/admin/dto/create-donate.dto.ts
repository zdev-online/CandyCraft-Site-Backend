import { Transform } from 'class-transformer';
import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDonateDto {
  @ApiProperty({ examples: ['Admin', 'Vip', 'Crafter'] })
  @IsNotEmpty({ message: 'Укажите название доната' })
  @IsString({ message: 'Укажите название доната' })
  name: string;

  @ApiProperty({ examples: [[1, 3, 9], [2], [2, 3]] })
  @IsNotEmpty({
    message:
      'ID серверов на которых доступен донат - должен быть числовым массивом, состоящим из ID - серверов в БД',
  })
  @IsArray({
    message:
      'ID серверов на которых доступен донат - должен быть числовым массивом, состоящим из ID - серверов в БД',
  })
  @Transform(({ value }) => value.map((x: number) => x.toString()).join(','))
  servers_id: string;

  @ApiProperty({ example: '6 приватов по 10.000 блоков' })
  @IsNotEmpty({ message: 'Укажите описание приватов для доната' })
  @IsString({ message: 'Укажите описание приватов для доната' })
  desc_private: string;

  @ApiProperty({ examples: ['flag1, flag2, flag3', 'flag1, flag2, flag'] })
  @IsNotEmpty({ message: 'Укажите описание флагов доната' })
  @IsString({ message: 'Укажите описание флагов доната' })
  desc_flags: string;

  @ApiProperty({ examples: ['/command_1, /command_2', '/command_1'] })
  @IsNotEmpty({ message: 'Укажите доступные команды доната' })
  @IsString({ message: 'Укажите доступные команды доната' })
  commands: string;

  @ApiProperty({ examples: [true, false] })
  @IsNotEmpty({
    message: 'Укажите возможность зайти на полный сервер для доната',
  })
  @IsBoolean({
    message: 'Укажите возможность зайти на полный сервер для доната',
  })
  can_enter_full_server: boolean;

  @ApiProperty({ examples: [true, false] })
  @IsNotEmpty({ message: 'Укажите сохранить инвентарь для доната' })
  @IsBoolean({ message: 'Укажите сохранить инвентарь для доната' })
  can_save_inventory: boolean;

  @ApiProperty({ examples: ['VIP', 'ADMIN', 'ROLE'] })
  @IsNotEmpty({ message: 'Укажите название PEX - права для доната' })
  @IsString({ message: 'Укажите название PEX - права для доната' })
  pex_name: string;

  @ApiProperty({ examples: [1, 3, 4] })
  @IsNotEmpty({ message: 'Укажите позицию доната' })
  @IsNumber({}, { message: 'Укажите позицию доната' })
  position: number;

  @ApiProperty({
    examples: ['имя_файла_с_сервера.png', 'имя_файла_с_сервера.jpeg'],
  })
  @IsNotEmpty({ message: 'Укажите изображение для доната' })
  @IsString({ message: 'Укажите изображение для доната' })
  image: string;

  @ApiProperty({ examples: [100, 20, 5] })
  @IsNotEmpty({ message: 'Укажите цену доната' })
  @IsNumber({}, { message: 'Укажите цену доната' })
  price: number;
}
