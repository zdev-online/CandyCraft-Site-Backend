import { ApiProperty } from '@nestjs/swagger';

export class SignUpResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  decs: string;

  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  user: {
    id: number;
    confirmed: boolean;
    email: string;
    role: string;
    userId: number;
    username: string;
    uuid: string;
  };
}
