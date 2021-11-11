import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GoogleModule } from 'src/google/google.module';
import { MailModule } from 'src/mail/mail.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Restore } from './restore.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Restore]),
    MailModule, UsersModule, TokensModule, GoogleModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
