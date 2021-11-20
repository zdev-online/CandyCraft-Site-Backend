import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PexModule } from 'src/pex/pex.module';
import { ServersModule } from 'src/servers/servers.module';
import { ServersService } from 'src/servers/servers.service';
import { ShopModule } from 'src/shop/shop.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    SequelizeModule.forFeature([]),
    ServersModule,
    PexModule,
    ShopModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
