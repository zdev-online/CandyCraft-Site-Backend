import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TokensModule } from './tokens/tokens.module';

@Module({
  imports: [AuthModule, UsersModule, TokensModule],
  controllers: [],
  providers: []
})
export class AppModule {}
