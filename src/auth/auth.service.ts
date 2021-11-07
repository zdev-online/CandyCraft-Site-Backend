import { BadRequestException, Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { TokensService } from 'src/tokens/tokens.service';
import { CreateUserRequestDto } from 'src/auth/dto/create-user-request.dto';
import { UsersService } from 'src/users/users.service';
import { AuthUserRequestDto } from './dto/auth-user-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
    private mailService: MailService,
  ) {}

  async signin(dto: AuthUserRequestDto) {}

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
  }

  async logout() {}

  async refresh() {}
}
