import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SkinsModule } from 'src/skins/skins.module';
import { SkinsService } from 'src/skins/skins.service';
import { UsersController } from './users.controller';
import { Users } from './users.entity';
import { UsersService } from './users.service';

@Module({
  imports: [SequelizeModule.forFeature([Users]), SkinsModule],
  controllers: [UsersController],
  providers: [UsersService, SkinsService],
  exports: [UsersService],
})
export class UsersModule {}
