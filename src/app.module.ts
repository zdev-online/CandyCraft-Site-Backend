import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TokensModule } from './tokens/tokens.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { MailModule } from './mail/mail.module';
import { GoogleService } from './google/google.service';
import { GoogleModule } from './google/google.module';
import { PexService } from './pex/pex.service';
import { PexModule } from './pex/pex.module';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.MODE}.env`,
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      autoLoadModels: true,
      sync: {
        force: true,
        alter: true,
      },
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    TokensModule,
    MailModule,
    GoogleModule,
    PexModule,
    AdminModule,
  ],
  controllers: [],
  providers: [AdminService],
})
export class AppModule {}
