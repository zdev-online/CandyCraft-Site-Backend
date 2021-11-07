import { Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/mail.service';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private tokensService: TokensService,
        private mailService: MailService 
    ) { }

    async signup(){}

    async signin(){}

    async logout(){}

    async refresh(){}
}
