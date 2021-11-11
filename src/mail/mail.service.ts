import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
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
    const url = `${process.env.SITE_URL}/auth/confirm/email/${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Завершите регистрацию в CandyCraft - подтвердите E-Mail!',
      template: './email-confirm',
      context: {
        username,
        email,
        url,
      },
    });
    return true;
  }

  generateToken(): string {
    return uuid.v4();
  }

  async sendPasswordRestore(email: string, username: string, token: string){
    const url = `${process.env.SITE_URL}/auth/restore/${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Восстановление пароля на CandyCraft - Перейдите по ссылке',
      template: './password-restore',
      context: {
        username,
        email,
        url,
      },
    });
    return true;
  }

  async createConfirmationEmail(mail: CreateMailDto) {
    let data = await this.mailEntity.create(mail);
    return data;
  }

  async findExpiredMails(): Promise<Mail[]> {
    const mailes = this.mailEntity.findAll({
      where: {
        expiresIn: {
          [Op.lte]: new Date(),
        },
      },
    });
    return mailes;
  }

  async findByToken(token: string): Promise<Mail> {
    let mail = this.mailEntity.findOne({
      where: {
        token,
      },
    });
    return mail;
  }
}
