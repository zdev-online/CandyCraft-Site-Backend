import { ApiProperty } from '@nestjs/swagger';
import { Column, Model, Table } from 'sequelize-typescript';
import { CreateProductDto } from './dto/create-product.dto';
import { IProduct } from './product.interface';

@Table({ tableName: 'site_products' })
export class Product extends Model<IProduct, CreateProductDto> {
  @ApiProperty()
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ApiProperty()
  @Column({ allowNull: false })
  product_id: number;

  @ApiProperty()
  @Column({ allowNull: false })
  type: string;

  @ApiProperty()
  @Column({ allowNull: false })
  price: number;
}
