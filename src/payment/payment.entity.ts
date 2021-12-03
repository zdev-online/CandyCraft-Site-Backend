import { Column, Model, Table } from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { IPayment } from './payment.interface';

@Table({ tableName: 'site_payments' })
export class Payment extends Model<IPayment, CreatePaymentDto> {
  @Column({ autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false, defaultValue: UUIDV4 })
  uuid: string;

  @Column({ allowNull: false })
  sum: number;

  @Column({ allowNull: false, defaultValue: false })
  status: boolean;
}
