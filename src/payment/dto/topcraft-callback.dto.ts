import { IsNotEmpty, IsString } from "class-validator";

export class TopcraftCallbackDto {
    @IsNotEmpty({ message: 'Не указан 1 из параметров' })
    @IsString({ message: 'Не указан 1 из параметров' })
    timestamp: string;

    @IsNotEmpty({ message: 'Не указан 1 из параметров' })
    @IsString({ message: 'Не указан 1 из параметров' })
    username: string;

    @IsNotEmpty({ message: 'Не указан 1 из параметров' })
    @IsString({ message: 'Не указан 1 из параметров' })
    signature: string;
}