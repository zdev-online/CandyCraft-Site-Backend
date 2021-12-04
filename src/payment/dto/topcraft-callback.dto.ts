import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TopcraftCallbackDto {
  @ApiProperty({ examples: ['TIMESTAMP_FROM_TOPCRAFT'] })
  @IsNotEmpty({ message: 'Не указан 1 из параметров' })
  @IsString({ message: 'Не указан 1 из параметров' })
  timestamp: string;

  @ApiProperty({ examples: ['USERNAME_FROM_TOPCRAFT'] })
  @IsNotEmpty({ message: 'Не указан 1 из параметров' })
  @IsString({ message: 'Не указан 1 из параметров' })
  username: string;

  @ApiProperty({ examples: ['SIGNATURE_FROM_TOPCRAFT'] })
  @IsNotEmpty({ message: 'Не указан 1 из параметров' })
  @IsString({ message: 'Не указан 1 из параметров' })
  signature: string;
}
