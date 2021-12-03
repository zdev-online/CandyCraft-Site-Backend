import { Column, DataType, Model } from "sequelize-typescript";
import { CreateFileDto } from "./dto/create-file.dto";
import { IFiles } from "./files.interface";

export class Files extends Model<IFiles, CreateFileDto> {
    @Column({ unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({
        unique: true,
        allowNull: false,
        defaultValue: DataType.UUIDV4,
        type: DataType.UUID,
    })
    uuid: string;

    @Column({ allowNull: false })
    filepath: string;
    @Column({ allowNull: false })
    filename: string;
}