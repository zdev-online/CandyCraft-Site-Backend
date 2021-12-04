import { ApiProperty } from '@nestjs/swagger';

export class ChangeSkinResponseDto {
  @ApiProperty()
  message: string;
  @ApiProperty()
  url: string;
}