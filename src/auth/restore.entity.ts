import { ApiProperty } from '@nestjs/swagger';
import { Table, Column, Model } from 'sequelize-typescript';
import { CreateRestoreDto } from './dto/create-restore.dto';
import { IRestore } from './restore.interface';

@Table({ tableName: 'site_restore_passwords' })
export class Restore extends Model<IRestore, CreateRestoreDto> {
  @ApiProperty()
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ApiProperty()
  @Column({ allowNull: false })
  token: string;

  @ApiProperty()
  @Column({ allowNull: false })
  userId: number;
}
