import { Column, Model, Table } from 'sequelize-typescript';
import { CreateProductDto } from './dto/create-product.dto';
import { IProduct } from './product.interface';


@Table({ tableName: 'site_products' })
export class Product extends Model<IProduct, CreateProductDto> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ allowNull: false })
  product_id: number;

  @Column({ allowNull: false })
  type: string;

  @Column({ allowNull: false })
  price: number;
}
