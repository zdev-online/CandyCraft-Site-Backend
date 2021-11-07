import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { TokensPayloadDto } from './dto/tokens-payload.dto';
import { Tokens } from './tokens.entity';

@Injectable()
export class TokensService {
  private JWT_ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET;
  private JWT_ACCESS_EXPIRES: string = process.env.JWT_ACCESS_EXPIRES;
  private JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET;
  private JWT_REFRESH_EXPIRES: string = process.env.JWT_REFRESH_EXPIRES;
  private JWT_REFRESH_EXPIRES_NUMBER: number =
    1000 *
    60 *
    60 *
    24 *
    parseInt(process.env.JWT_REFRESH_EXPIRES.replace('d', ''));
  constructor(
    private jwtService: JwtService,
    @InjectModel(Tokens) private tokensEntity: typeof Tokens,
  ) {
    this.deleteExpiredTokens();
  }

  async generateTokens(payload: TokensPayloadDto): Promise<string[]> {
    let access_token = await this.generateAccessToken(payload);
    let refresh_token = await this.generateRefreshToken(payload);
    return [access_token, refresh_token];
  }
  async validateRefresh(token: string): Promise<TokensPayloadDto> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.JWT_ACCESS_SECRET,
    });
  }
  async validateAccess(token: string): Promise<TokensPayloadDto> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.JWT_REFRESH_SECRET,
    });
  }
  private async generateAccessToken(
    payload: TokensPayloadDto,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.JWT_ACCESS_EXPIRES,
      secret: this.JWT_ACCESS_SECRET,
    });
  }
  private async generateRefreshToken(
    payload: TokensPayloadDto,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.JWT_REFRESH_EXPIRES,
      secret: this.JWT_REFRESH_SECRET,
    });
  }
  async createOrRefreshToken(
    refresh_token: string,
    userId: number,
  ): Promise<Tokens> {
    let token = await this.tokensEntity.findOne({
      where: {
        value: refresh_token,
      },
    });
    if (token) {
      token.value = refresh_token;
      return await token.save();
    }
    return await this.tokensEntity.create({
      userId,
      value: refresh_token,
      expiresIn: new Date(
        new Date().getTime() + this.JWT_REFRESH_EXPIRES_NUMBER,
      ),
    });
  }

  // Каждые 5 дней - очистка просроченных токенов!
  private async deleteExpiredTokens() {
    let number = await this.tokensEntity
      .destroy({
        where: {
          expiresIn: {
            [Op.lte]: new Date(),
          },
        },
      })
      .catch((e) =>
        console.error(`Не удалось очистить просроченные токены: ${e.message}`),
      );
    typeof number == 'number' && console.log(`Удалено токенов: ${number}`);
    setTimeout(this.deleteExpiredTokens, 1000 * 60 * 60 * 24 * 5);
  }
}
