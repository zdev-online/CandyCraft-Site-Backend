import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';
import { Servers } from './servers.entity';

@Module({
    imports: [SequelizeModule.forFeature([Servers])],
    providers: [ServersService],
    exports: [ServersService],
    controllers: [ServersController]
})
export class ServersModule {}
