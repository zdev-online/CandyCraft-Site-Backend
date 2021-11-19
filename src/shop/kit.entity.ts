import { Column, Model } from "sequelize-typescript";
import { CreateKitDto } from "./dto/create-kit.dto";
import { IKit } from "./kit.interface";

export class Kit extends Model<IKit, CreateKitDto> {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @Column({ allowNull: false })
    donate_id: number;

    @Column({ allowNull: false })
    name: string;
    
    @Column({ allowNull: false })
    image: string;
}