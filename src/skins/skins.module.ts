import { Module } from '@nestjs/common';
import { SkinsService } from './skins.service';

@Module({
  imports: [],
  providers: [SkinsService],
  controllers: [],
  exports: [SkinsService]
})
export class SkinsModule {}
