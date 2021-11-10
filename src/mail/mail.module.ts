import { Module } from '@nestjs/common';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { join } from 'path';
import { MailService } from './mail.service';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { SequelizeModule } from '@nestjs/sequelize';
import { Mail } from './mail.entity';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (...args: any[]): MailerOptions | Promise<MailerOptions> => {
        return {
          transport: {
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT),
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            },
            secure: process.env.MYSQL_SECURE == 'true' ? true : undefined,
          },
          defaults: {
            from: process.env.MAIL_FROM,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new EjsAdapter(),
            options: {},
          },
        };
      },
    }),
    SequelizeModule.forFeature([Mail]),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
