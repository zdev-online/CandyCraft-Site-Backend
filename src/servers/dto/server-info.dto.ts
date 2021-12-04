import { ApiProperty } from '@nestjs/swagger';
import { Player } from 'gamedig';

export class ServerInfoDto {
  @ApiProperty()
  active: boolean;

  @ApiProperty()
  max_players: number;

  @ApiProperty()
  players: Player[];

  @ApiProperty()
  ping: number;

  @ApiProperty()
  connect: string;
}
