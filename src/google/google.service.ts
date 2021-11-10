import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GoogleService {
  private google_captcha_verify_url: string =
    'https://www.google.com/recaptcha/api/siteverify';

  async verifyCaptcha(token: string): Promise<boolean> {
    try {
      const response = await axios.post(this.google_captcha_verify_url, {
        secret: process.env.GOOGLE_RECAPTCHA_SECRET,
        response: token,
      });

      const data = response.data as { success: boolean; [key: string]: any };

      return data.success;
    } catch {
      throw new InternalServerErrorException({
        message: 'Невозможно проверить ReCaptcha',
      });
    }
  }
}
