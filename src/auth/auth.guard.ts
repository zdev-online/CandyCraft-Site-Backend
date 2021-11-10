import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokensService } from 'src/tokens/tokens.service';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';

export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokensService,
    private reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    return new Promise(async (resolve, reject): Promise<boolean> => {
      try {
        const request: Request = ctx.switchToHttp().getRequest();
        const [type, token] = request.headers.authorization.split(' ');
        if (!type || !token) {
          throw new UnauthorizedException({ message: 'Вы не авторизованы' });
        }

        const data = await this.tokenService.validateAccess(token);

        const isForConfirmed = this.reflector.get<boolean>(
          'for_confirmed_email',
          ctx.getHandler(),
        );
        const isForAdmin = this.reflector.get<boolean>(
          'for_admin',
          ctx.getHandler(),
        );
        if (isForConfirmed && !data.confirmed) {
          throw new UnauthorizedException({
            message: 'Только для пользователей с подтвержденным E-Mail',
          });
        }

        if (isForAdmin && data.role !== 'admin') {
          throw new UnauthorizedException({ message: 'Доступ запрещен' });
        }

        return true;
      } catch (e) {
        if (e instanceof JsonWebTokenError || e instanceof TokenExpiredError) {
          throw new UnauthorizedException({ message: 'Вы не авторизованы' });
        }
        return false;
      }
    });
  }
}
