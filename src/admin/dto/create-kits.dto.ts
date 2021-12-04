import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateKitsDto {
  @ApiProperty({ examples: ['Diamond kit', 'Gold', 'Wonderful'] })
  @IsNotEmpty({ message: 'Укажите название кита доната' })
  @IsString({ message: 'Укажите название кита доната' })
  name: string;

  @ApiProperty({ examples: ['имя_файла_с_сервера.png', 'имя_файла_с_сервера.jpeg'] })
  @IsNotEmpty({ message: 'Укажите изображение кита доната' })
  @IsArray({ message: 'Укажите изображение для кита доната' })
  image: string;
}
