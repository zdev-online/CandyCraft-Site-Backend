import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tokens } from './tokens.entity';
import { TokensService } from './tokens.service';

@Module({
  imports: [JwtModule.register({}), SequelizeModule.forFeature([Tokens])],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
