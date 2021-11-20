import { IsNumber, IsString } from 'class-validator';

export class CreateCaseDto {
  @IsString({ message: 'Укажите название кейса' })
  name: string;

  @IsString({ message: 'Укажите редкость кейса' })
  rare: string;

  @IsNumber({}, { message: 'Укажите позицию кейса' })
  position: number;
}
