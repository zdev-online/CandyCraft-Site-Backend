import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemsCaseDto {
  @ApiProperty({ examples: ['Ультра - Кейс', "Мега - Кейс", "Кейс"] })
  @IsNotEmpty({ message: 'Укажите название предмета кейса' })
  @IsString({ message: 'Укажите название предмета кейса' })
  name: string;

  @ApiProperty({ examples: ["diamond", 'gold', 'В принципе любое значение, т.к с этим значением работает только фронт'] })
  @IsNotEmpty({ message: 'Укажите редкость предмета кейса' })
  @IsString({ message: 'Укажите редкость предмета кейса' })
  rare: string;

  @ApiProperty({ examples: [1,2,3] })
  @IsNotEmpty({ message: 'Укажите позицию предмета кейса' })
  @IsNumber({}, { message: 'Укажите позицию предмета кейса' })
  position: number;

  @ApiProperty({ examples: ['имя_файла_с_сервера.png', 'имя_файла_с_сервера.jpeg'] })
  @IsNotEmpty({ message: 'Укажите изображение предмета кейса' })
  @IsString({ message: 'Укажите изображение предмета кейса' })
  image: string;
}
