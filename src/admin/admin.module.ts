import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    SequelizeModule.forFeature([])
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
