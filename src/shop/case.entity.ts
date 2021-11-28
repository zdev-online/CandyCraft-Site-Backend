import { Column, Model, Table } from 'sequelize-typescript';
import { ICase } from './case.interface';
import { CreateCaseDto } from './dto/create-case.dto';

@Table({ tableName: 'site_cases' })
export class Case extends Model<ICase, CreateCaseDto> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  image: string;

  @Column({ allowNull: false })
  rare: string;

  @Column({ allowNull: false, unique: true })
  position: number;
}