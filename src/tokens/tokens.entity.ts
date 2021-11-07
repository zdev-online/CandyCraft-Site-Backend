import { Table, Model, Column } from 'sequelize-typescript';
import { CreateRefreshDto } from './dto/create-refresh.dto';
import { ITokens } from './tokens.interface';

@Table({ tableName: 'site_tokens' })
export class Tokens extends Model<ITokens, CreateRefreshDto> {
    @Column({ unique: true, autoIncrement: true, primaryKey: true }) 
    id: number;
    
    @Column({ allowNull: false, unique: true }) 
    value: string;
    
    @Column({ allowNull: false }) 
    userId: number;
    
    @Column({ allowNull: false })     
    expiresIn: Date;
}