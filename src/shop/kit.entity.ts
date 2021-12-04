import { ApiProperty } from '@nestjs/swagger';
import { Column, Model, Table } from 'sequelize-typescript';
import { CreateKitDto } from './dto/create-kit.dto';
import { IKit } from './kit.interface';

@Table({ tableName: 'site_kits' })
export class Kit extends Model<IKit, CreateKitDto> {
  @ApiProperty()
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ApiProperty()
  @Column({ allowNull: false })
  donate_id: number;

  @ApiProperty()
  @Column({ allowNull: false })
  name: string;

  @ApiProperty()
  @Column({ allowNull: false })
  image: string;
}
