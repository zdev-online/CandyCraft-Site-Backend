import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as uuid from 'uuid';
import { CreateMailDto } from './dto/create-mail';
import { Mail } from './mail.entity';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectModel(Mail) private mailEntity: typeof Mail,
  ) {}

  async sendEmailConfirmation(email: string, username: string, token: string) {
    const url = `${process.env.SITE_URL}/confirm/email/${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Завершите регистрацию в CandyCraft - подтвердите E-Mail!',
      template: './email-confirm',
      context: {
        url,
        username,
        email,
      },
    });
    return true;
  }

  generateToken(): string {
    return uuid.v4({
      random: Buffer.from(`${Math.random() * 1000 + new Date().getTime()}`),
    });
  }

  async createConfirmationEmail(mail: CreateMailDto) {
    return await this.mailEntity.create(mail);
  }
}
