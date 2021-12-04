import { ApiProperty } from '@nestjs/swagger';
import { Column, Model, Table } from 'sequelize-typescript';
import { CreateItemsDto } from './dto/create-items.dto';
import { IItems } from './items.interface';

@Table({ tableName: 'site_items' })
export class Items extends Model<IItems, CreateItemsDto> {
  @ApiProperty()
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ApiProperty()
  @Column({ allowNull: false })
  case_id: number;

  @ApiProperty()
  @Column({ allowNull: false })
  name: string;

  @ApiProperty()
  @Column({ allowNull: false })
  image: string;

  @ApiProperty()
  @Column({ allowNull: false })
  rare: string;

  @ApiProperty()
  @Column({ allowNull: false, unique: true })
  position: number;
}
