import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailResponseDto {
  @ApiProperty()
  message: string;
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  refresh_token: string;
}