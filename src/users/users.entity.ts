import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { v4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { IUsers } from './users.interface';

@Table({ tableName: 'site_users' })
export class Users extends Model<IUsers, CreateUserDto> {
  @Column({ unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({
    unique: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
    type: DataType.UUID,
  })
  uuid: string;

  @Column({ unique: true, allowNull: false })
  email: string;

  @Column({ unique: true, allowNull: false })
  username: string;

  @Column({ allowNull: false })
  password: string;

  @Column({ allowNull: false, defaultValue: 0 })
  money: number;

  @Column({ allowNull: false, defaultValue: false })
  confirmed: boolean;

  @Column({ allowNull: false, defaultValue: 'user' })
  role: string;

  @Column({ allowNull: false, defaultValue: '/skins/default.png' })
  skinPath: string;
}
