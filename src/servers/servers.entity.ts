import { Table, Model, Column, DataType } from 'sequelize-typescript';
import { CreateServerDto } from './dto/create-server.dto';
import { IServers } from './servers.interface';

@Table({ tableName: 'site_servers' })
export class Servers extends Model<IServers, CreateServerDto> {
  @Column({ autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ allowNull: false })
  pex_prefix: string;

  @Column({ allowNull: false })
  server_name: string;

  @Column({ allowNull: false })
  server_desc: string;

  @Column({ allowNull: false })
  server_ip: string;

  @Column({ allowNull: false })
  server_port: number;

  @Column({ allowNull: false })
  rcon_port: number;

  @Column({ allowNull: false, type: DataType.TEXT })
  server_gif_path: string;

  @Column({ allowNull: false, defaultValue: true })
  active: boolean;

  @Column({ allowNull: false })
  game_version: string;

  @Column({ allowNull: false })
  mods: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  media: string;

  @Column({ allowNull: false, unique: true })
  position: number;
}
