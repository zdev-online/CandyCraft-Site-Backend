import { ApiProperty } from '@nestjs/swagger';
import { Table, Model, Column, DataType } from 'sequelize-typescript';
import { CreateServerDto } from './dto/create-server.dto';
import { IServers } from './servers.interface';

@Table({ tableName: 'site_servers' })
export class Servers extends Model<IServers, CreateServerDto> {
  @ApiProperty()
  @Column({ autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty()
  @Column({ allowNull: false })
  pex_prefix: string;

  @ApiProperty()
  @Column({ allowNull: false })
  server_name: string;

  @ApiProperty()
  @Column({ allowNull: false })
  server_desc: string;

  @ApiProperty()
  @Column({ allowNull: false })
  server_ip: string;

  @ApiProperty()
  @Column({ allowNull: false })
  server_port: number;

  @ApiProperty()
  @Column({ allowNull: false })
  rcon_port: number;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.TEXT })
  server_gif: string;

  @ApiProperty()
  @Column({ allowNull: false, defaultValue: true })
  active: boolean;

  @ApiProperty()
  @Column({ allowNull: false })
  game_version: string;

  @ApiProperty()
  @Column({ allowNull: false })
  mods: string;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.TEXT })
  media: string;

  @ApiProperty()
  @Column({ allowNull: false, unique: true })
  position: number;
}
