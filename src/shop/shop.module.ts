import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShopController } from './shop.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([])
  ],
  controllers: [ShopController]
})
export class ShopModule {}
