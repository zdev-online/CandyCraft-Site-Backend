import { Column, Model, Table } from 'sequelize-typescript';
import { IDonate } from './donate.interface';
import { CreateDonateDto } from './dto/create-donate.dto';

@Table({ tableName: 'site_donate' })
export class Donate extends Model<IDonate, CreateDonateDto> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ allowNull: false })
  image: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  servers_id: string;

  @Column({ allowNull: false })
  desc_private: string;

  @Column({ allowNull: false })
  desc_flags: string;

  @Column({ allowNull: false })
  commands: string;

  @Column({ allowNull: false })
  can_enter_full_server: boolean;

  @Column({ allowNull: false })
  can_save_inventory: boolean;

  @Column({ allowNull: false })
  pex_name: string;

  @Column({ allowNull: false })
  position: number;
}
