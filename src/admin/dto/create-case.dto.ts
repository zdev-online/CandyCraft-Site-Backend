import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCaseDto {
  @ApiProperty({ example: 'Diamond Case' })
  @IsNotEmpty({ message: 'Укажите название кейса' })
  @IsString({ message: 'Укажите название кейса' })
  name: string;

  @ApiProperty({ examples: [1,2,3] })
  @IsNotEmpty({ message: 'Укажите позицию кейса' })
  @IsNumber({}, { message: 'Укажите позицию кейса' })
  position: number;

  @ApiProperty({ example: 'give case %player% %chest% %count%' })
  @IsNotEmpty({ message: 'Укажите команду для выдачи кейса' })
  @IsString({ message: 'Укажите команду для выдачи кейса' })
  command: string;

  @ApiProperty({ example: '%player%' })
  @IsNotEmpty({ message: 'Укажите шаблон сундука. (Пример: %chest%)' })
  @IsString({ message: 'Укажите шаблон сундука. (Пример: %chest%)' })
  chest_template: string;

  @ApiProperty({ example: '%chest%' })
  @IsNotEmpty({ message: 'Укажите шаблон игрока. (Пример: %player_name%)' })
  @IsString({ message: 'Укажите шаблон игрока. (Пример: %player_name%)' })
  player_template: string;

  @ApiProperty({ example: '%count%' })
  @IsNotEmpty({
    message: 'Укажите шаблон количества сундуков. (Пример: %count%)',
  })
  @IsString({
    message: 'Укажите шаблон количества сундуков. (Пример: %count%)',
  })
  count_template: string;

  @ApiProperty({ examples: ['имя_файла_с_сервера.png', 'имя_файла_с_сервера.jpeg'] })
  @IsNotEmpty({ message: 'Укажите изображение для кейса' })
  @IsString({ message: 'Укажите изображение для кейса' })
  image: string;

  @ApiProperty({ example: [100, 20, 5] })
  @IsNotEmpty({ message: 'Укажите цену кейса' })
  @IsNumber({}, { message: 'Укажите цену кейса' })
  price: number;
}
