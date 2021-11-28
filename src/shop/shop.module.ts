import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PexModule } from 'src/pex/pex.module';
import { Users } from 'src/users/users.entity';
import { Case } from './case.entity';
import { Donate } from './donate.entity';
import { Items } from './items.entity';
import { Kit } from './kit.entity';
import { Product } from './product.entity';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Case, Product, Donate, Items, Kit, Users]),
    PexModule,
  ],
  providers: [ShopService],
  controllers: [ShopController],
  exports: [ShopService],
})
export class ShopModule {}
