import { IsString, IsNumber } from 'class-validator';

export class CreateItemsCaseDto {
  @IsString({ message: 'Укажите название предмета кейса' })
  name: string;

  @IsString({ message: 'Укажите редкость предмета кейса' })
  rare: string;

  @IsNumber({}, { message: 'Укажите позицию предмета кейса' })
  position: number;
}
