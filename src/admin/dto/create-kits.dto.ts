import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateKitsDto {
  @IsNotEmpty({ message: 'Укажите название кита доната' })
  @IsString({ message: 'Укажите название кита доната' })
  name: string;

  @IsNotEmpty({ message: 'Укажите изображение кита доната' })
  @IsArray({ message: 'Укажите изображение для кита доната' })
  image: string;
}
