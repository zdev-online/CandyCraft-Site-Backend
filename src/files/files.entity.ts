import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { CreateFileDto } from './dto/create-file.dto';
import { IFiles } from './files.interface';

@Table({ tableName: 'site_files' })
export class Files extends Model<IFiles, CreateFileDto> {
  @ApiProperty()
  @Column({ unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty()
  @Column({
    unique: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
    type: DataType.UUID,
  })
  uuid: string;

  @ApiProperty()
  @Column({ allowNull: false })
  filepath: string;
  @ApiProperty()
  @Column({ allowNull: false })
  filename: string;
}
