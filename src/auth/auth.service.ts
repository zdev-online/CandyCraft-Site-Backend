import { BadRequestException, Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { TokensService } from 'src/tokens/tokens.service';
import { CreateUserRequestDto } from 'src/auth/dto/create-user-request.dto';
import { UsersService } from 'src/users/users.service';
import { AuthUserRequestDto } from './dto/auth-user-request.dto';
import { GoogleService } from 'src/google/google.service';
import { UsersSerialize } from './dto/user-serialize.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
    private mailService: MailService,
    private googleService: GoogleService
  ) { 
    this.deleteUnconfirmedUsers();
  }

  async signin(dto: AuthUserRequestDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || this.usersService.isValidPassword(dto.password, user.password)) {
      throw new BadRequestException({ message: 'Неверный E-Mail или пароль' });
    }
    const [access_token, refresh_token] = await this.tokensService.generateTokens({
      confirmed: user.confirmed,
      email: user.email,
      role: user.role,
      userId: user.id,
      username: user.username,
      id: user.id
    });

    return {
      access_token,
      refresh_token,
      ...new UsersSerialize(user),
      message: 'Успешная авторизация'
    }
  }

  async signup(dto: CreateUserRequestDto) {
    if (!dto.agreement) {
      throw new BadRequestException({
        message: 'Вы не согласились с пользовательским соглашением',
      });
    }
    if (dto.password !== dto.password_confirm) {
      throw new BadRequestException({
        message: 'Пароли не совпадают',
      });
    }
    // const isCorrectCaptcha = await this.googleService.verifyCaptcha(dto.captcha_token);
    // if (!isCorrectCaptcha) {
    //   throw new BadRequestException({
    //     message: 'Неверная капча'
    //   });
    // }
    const candidate = await this.usersService.findByEmailAndUsername(dto.email, dto.username);
    if (candidate) {
      throw new BadRequestException({
        message: 'Пользователь с таким E-Mail или никнеймом уже сущетсвует'
      })
    }
    const user = await this.usersService.create(dto);
    const mail = await this.mailService.createConfirmationEmail({
      userId: user.id,
      token: this.mailService.generateToken(),
      expiresIn: new Date(new Date().getTime() + 1000 * 60 * 30)
    });
    await this.mailService.sendEmailConfirmation(user.email, user.username, mail.token);

    const [access_token, refresh_token] = await this.tokensService.generateTokens({
      confirmed: user.confirmed,
      email: user.email,
      role: user.role,
      userId: user.id,
      username: user.username,
      id: user.id
    });
    return {
      message: 'Перейдите по ссылке в письме, которую мы отправили на ваш почтовый ящик',
      decs: 'Если почта не будет подтверждена в течении 30 минут - аккаунт будет удален',
      access_token,
      refresh_token,
      ...new UsersSerialize(user)
    }
  }

  async logout(refresh_token: string) {
    const token = await this.tokensService.findRefreshTokenByValue(refresh_token);
    if (token) {
      await this.tokensService.deleteRefreshToken(token.value);
    }
  }

  async refresh(value: string) {
    const isValid = await this.tokensService.validateRefresh(value);
    if(!isValid){
      throw new BadRequestException({ message: 'Вы не авторизованы' });
    }
    const token = await this.tokensService.findRefreshTokenByUserId(isValid.userId);
    const user = await this.usersService.findById(isValid.userId);
    if(!user){
      throw new BadRequestException({ message: 'Вы не авторизованы' });
    }
    const [access_token, refresh_token] = await this.tokensService.generateTokens({
      confirmed: user.confirmed,
      email: user.email,
      role: user.role,
      userId: user.id,
      username: user.username,
      id: user.id
    });
    token.value = refresh_token;
    await token.save();
    return {
      access_token,
      refresh_token,
      ...new UsersSerialize(user)
    }
  }

  async confirmEmail(token: string){
    const mail = await this.mailService.findByToken(token);
    if(!mail){
      throw new BadRequestException({ message: 'Ссылка просрочена, либо уже аккаунт уже активирован' })
    }
    const user = await this.usersService.findById(mail.userId);
    user.confirmed = true;
    await user.save();
    await mail.destroy();
    return {
      message: 'E-Mail успешно подтвержден',
      devInfo: 'Сделайте запрос на /auth/refresh, чтобы обновить токен'
    }
  }

  private async deleteUnconfirmedUsers(){
    try {
      const mailes = await this.mailService.findExpiredMails();
      if(mailes.length){
        const deleted = await this.usersService.deleteManyByIds(mailes.map(x => x.userId));
        console.log(`Удалено пользователей - не подтвердивших E-Mail: ${deleted}`);
      }
    } catch(e){
      console.error(`Не удалось удалить полльзователей, которые не подтвердили E-Mail`);
    } finally {
      setTimeout(this.deleteUnconfirmedUsers, 1000 * 60 * 60 * 15);
    }
  }
}
