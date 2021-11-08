import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

@Injectable()
export class PexService {
    constructor(@InjectConnection() private connection: Sequelize){}
}
