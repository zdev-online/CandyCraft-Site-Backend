import { ApiProperty } from '@nestjs/swagger';
import { Column, Model, Table } from 'sequelize-typescript';
import { IDonate } from './donate.interface';
import { CreateDonateDto } from './dto/create-donate.dto';

@Table({ tableName: 'site_donate' })
export class Donate extends Model<IDonate, CreateDonateDto> {
  @ApiProperty()
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ApiProperty()
  @Column({ allowNull: false })
  image: string;

  @ApiProperty()
  @Column({ allowNull: false })
  name: string;

  @ApiProperty()
  @Column({ allowNull: false })
  servers_id: string;

  @ApiProperty()
  @Column({ allowNull: false })
  desc_private: string;

  @ApiProperty()
  @Column({ allowNull: false })
  desc_flags: string;

  @ApiProperty()
  @Column({ allowNull: false })
  commands: string;

  @ApiProperty()
  @Column({ allowNull: false })
  can_enter_full_server: boolean;

  @ApiProperty()
  @Column({ allowNull: false })
  can_save_inventory: boolean;

  @ApiProperty()
  @Column({ allowNull: false })
  pex_name: string;

  @ApiProperty()
  @Column({ allowNull: false })
  position: number;
}
