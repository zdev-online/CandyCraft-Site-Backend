import { IsNumber, IsString } from 'class-validator';

export class CreateCaseDto {
  @IsString({ message: 'Укажите название кейса' })
  name: string;

  @IsString({ message: 'Укажите редкость кейса' })
  rare: string;

  @IsNumber({}, { message: 'Укажите позицию кейса' })
  position: number;

  @IsString({ message: 'Укажите команду для выдачи кейса' })
  command: string;

  @IsString({ message: 'Укажите шаблон сундука. (Пример: %chest%)' })
  chest_template: string;

  @IsString({ message: 'Укажите шаблон игрока. (Пример: %player_name%)' })
  player_template: string;

  @IsString({
    message: 'Укажите шаблон количества сундуков. (Пример: %count%)',
  })
  count_template: string;
}
