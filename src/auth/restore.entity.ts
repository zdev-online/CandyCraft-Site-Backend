import { Table, Column, Model } from 'sequelize-typescript';
import { CreateRestoreDto } from './dto/create-restore.dto';
import { IRestore } from './restore.interface';

@Table({ tableName: 'site_restore_passwords' })
export class Restore extends Model<IRestore, CreateRestoreDto> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ allowNull: false })
  token: string;

  @Column({ allowNull: false })
  userId: number;
}
