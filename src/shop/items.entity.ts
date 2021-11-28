import { Column, Model, Table } from 'sequelize-typescript';
import { CreateItemsDto } from './dto/create-items.dto';
import { IItems } from './items.interface';

@Table({ tableName: 'site_items' })
export class Items extends Model<IItems, CreateItemsDto> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ allowNull: false })
  case_id: number;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  image: string;

  @Column({ allowNull: false })
  rare: string;

  @Column({ allowNull: false, unique: true })
  position: number;
}
