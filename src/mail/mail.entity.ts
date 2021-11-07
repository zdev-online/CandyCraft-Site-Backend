import { Table, Model, Column } from 'sequelize-typescript';
import { CreateMailDto } from './dto/create-mail';
import { IMail } from './mail.interface';

@Table({ tableName: 'site_mails' })
export class Mail extends Model<IMail, CreateMailDto> {
  @Column({ unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ unique: true, allowNull: false })
  userId: number;

  @Column({ unique: true, allowNull: false })
  token: string;

  @Column({ allowNull: false })
  expiresIn: Date;
}
