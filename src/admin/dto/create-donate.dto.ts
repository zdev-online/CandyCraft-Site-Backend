import { Transform } from "class-transformer";
import { IsString, IsArray, IsNotEmpty, IsBoolean, IsNumber } from "class-validator";

export class CreateDonateDto {
  @IsNotEmpty({ message: 'Укажите название доната' })
  @IsString({ message: 'Укажите название доната' })
  name: string;

  @IsNotEmpty({ message: 'ID серверов на которых доступен донат - дорлжны быть числовым массивом, состоящим из ID - серверов в БД' })
  @IsArray({ message: 'ID серверов на которых доступен донат - дорлжны быть числовым массивом, состоящим из ID - серверов в БД' })
  @Transform(({ value }) => value.map((x: number)=> x.toString()).join(','))
  servers_id: string;

  @IsNotEmpty({ message: 'Укажите описание приватов для доната' })
  @IsString({ message: 'Укажите описание приватов для доната' })
  desc_private: string;

  @IsNotEmpty({ message: 'Укажите описание флагов доната' })
  @IsString({ message: 'Укажите описание флагов доната' })
  desc_flags: string;

  @IsNotEmpty({ message: 'Укажите доступные команды доната' })
  @IsString({ message: 'Укажите доступные команды доната' })
  commands: string;

  @IsNotEmpty({ message: 'Укажите возможность зайти на полный сервер для доната' })
  @IsBoolean({ message: 'Укажите возможность зайти на полный сервер для доната' })
  can_enter_full_server: boolean;

  @IsNotEmpty({ message: 'Укажите сохранить инвентарь для доната' })
  @IsBoolean({ message: 'Укажите сохранить инвентарь для доната' })
  can_save_inventory: boolean;

  @IsNotEmpty({ message: 'Укажите название PEX - права для доната' })
  @IsString({ message: 'Укажите название PEX - права для доната' })
  pex_name: string;

  @IsNotEmpty({ message: 'Укажите позицию сервера' })
  @IsNumber({}, { message: 'Укажите позицию сервера' })
  position: number;
}
