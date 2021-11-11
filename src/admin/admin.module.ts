import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServersModule } from 'src/servers/servers.module';
import { ServersService } from 'src/servers/servers.service';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    SequelizeModule.forFeature([]),
    ServersModule
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
