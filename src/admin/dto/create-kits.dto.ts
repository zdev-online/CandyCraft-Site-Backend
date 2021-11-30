import { IsNotEmpty, IsString } from "class-validator";

export class CreateKitsDto {
  @IsNotEmpty({ message: 'Укажите название кита доната' })
  @IsString({ message: 'Укажите название кита доната' })
  name: string;
}
