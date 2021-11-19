import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from 'src/users/users.entity';
import { Case } from './case.entity';
import { Donate } from './donate.entity';
import { Items } from './items.entity';
import { Kit } from './kit.entity';
import { Product } from './product.entity';
import { ShopController } from './shop.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Case, Product, Donate, Items, Kit, Users])
  ],
  controllers: [ShopController]
})
export class ShopModule {}
