import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from 'src/users/users.entity';
import { PaymentController } from './payment.controller';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';

@Module({
  imports: [SequelizeModule.forFeature([Payment, Users])],
  controllers: [PaymentController],
  providers: [PaymentService] 
})
export class PaymentModule {}
