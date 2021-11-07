import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

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
}
