import { ApiProperty } from '@nestjs/swagger';
import { Column, Model, Table } from 'sequelize-typescript';
import { ICase } from './case.interface';
import { CreateCaseDto } from './dto/create-case.dto';

@Table({ tableName: 'site_cases' })
export class Case extends Model<ICase, CreateCaseDto> {
  @ApiProperty()
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ApiProperty()
  @Column({ allowNull: false })
  name: string;

  @ApiProperty()
  @Column({ allowNull: false })
  image: string;

  @ApiProperty()
  @Column({ allowNull: false, unique: true })
  position: number;

  @ApiProperty()
  @Column({ allowNull: false })
  command: string;

  @ApiProperty()
  @Column({ allowNull: false })
  chest_template: string;

  @ApiProperty()
  @Column({ allowNull: false })
  player_template: string;

  @ApiProperty()
  @Column({ allowNull: false })
  count_template: string;
}
