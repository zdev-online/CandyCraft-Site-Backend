import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateItemsCaseDto {
  @IsNotEmpty({ message: 'Укажите название предмета кейса' })
  @IsString({ message: 'Укажите название предмета кейса' })
  name: string;

  @IsNotEmpty({ message: 'Укажите редкость предмета кейса' })
  @IsString({ message: 'Укажите редкость предмета кейса' })
  rare: string;

  @IsNotEmpty({ message: 'Укажите позицию предмета кейса' })
  @IsNumber({}, { message: 'Укажите позицию предмета кейса' })
  position: number;

  @IsNotEmpty({ message: 'Укажите изображение предмета кейса' })
  @IsString({ message: 'Укажите изображение предмета кейса' })
  image: string;
}
