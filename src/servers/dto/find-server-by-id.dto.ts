import { ApiProperty } from '@nestjs/swagger';

export class FindServerByIdDto {
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  server_name: string;
  
  @ApiProperty()
  server_desc: string;
  
  @ApiProperty()
  server_ip: string;
  
  @ApiProperty()
  server_port: number;
  
  @ApiProperty()
  server_gif: string;
  
  @ApiProperty()
  active: boolean;
  
  @ApiProperty()
  game_version: string;
  
  @ApiProperty()
  mods: string;
  
  @ApiProperty()
  media: string;
  
  @ApiProperty()
  position: number;
}
