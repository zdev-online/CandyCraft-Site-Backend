import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TokensService } from 'src/tokens/tokens.service';
import { Reflector } from '@nestjs/core';

export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokensService,
    private reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      throw new UnauthorizedException({ message: 'Вы не авторизованы' });
    }
    const [type, token] = request.headers.authorization.split(' ');
    if (!type || !token) {
      throw new UnauthorizedException({ message: 'Вы не авторизованы' });
    }

    const data = await this.tokenService.validateAccess(token);
    if (!data) {
      throw new UnauthorizedException({ message: 'Вы не авторизованы' });
    }

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
    request.user = data;
    return true;
  }
}
