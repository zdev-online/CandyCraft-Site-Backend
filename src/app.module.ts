import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TokensModule } from './tokens/tokens.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { MailModule } from './mail/mail.module';
import { GoogleModule } from './google/google.module';
import { PexModule } from './pex/pex.module';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';
import { ServersModule } from './servers/servers.module';
import { ShopModule } from './shop/shop.module';
import { SkinsModule } from './skins/skins.module';
import { join } from 'path';
import { PaymentService } from './payment/payment.service';
import { PaymentModule } from './payment/payment.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logger.interceptor';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
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
    ServersModule,
    ShopModule,
    SkinsModule,
    PaymentModule,
    FilesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
