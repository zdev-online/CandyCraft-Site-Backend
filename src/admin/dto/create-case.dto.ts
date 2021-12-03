import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCaseDto {
  @IsNotEmpty({ message: 'Укажите название кейса' })
  @IsString({ message: 'Укажите название кейса' })
  name: string;
  
  @IsNotEmpty({ message: 'Укажите позицию кейса' })
  @IsNumber({}, { message: 'Укажите позицию кейса' })
  position: number;

  @IsNotEmpty({ message: 'Укажите команду для выдачи кейса' })
  @IsString({ message: 'Укажите команду для выдачи кейса' })
  command: string;

  @IsNotEmpty({ message: 'Укажите шаблон сундука. (Пример: %chest%)' })
  @IsString({ message: 'Укажите шаблон сундука. (Пример: %chest%)' })
  chest_template: string;

  @IsNotEmpty({ message: 'Укажите шаблон игрока. (Пример: %player_name%)' })
  @IsString({ message: 'Укажите шаблон игрока. (Пример: %player_name%)' })
  player_template: string;

  @IsNotEmpty({ message: 'Укажите шаблон количества сундуков. (Пример: %count%)' })
  @IsString({ message: 'Укажите шаблон количества сундуков. (Пример: %count%)' })
  count_template: string;
  
  @IsNotEmpty({ message: 'Укажите изображение для кейса' })
  @IsString({ message: 'Укажите изображение для кейса' })
  image: string;

  @IsNotEmpty({ message: 'Укажите цену кейса' })
  @IsNumber({}, { message: 'Укажите цену кейса' })
  price: number;
}
