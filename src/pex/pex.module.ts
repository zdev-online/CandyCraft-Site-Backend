import { Module } from '@nestjs/common';
import { PexService } from './pex.service';

@Module({
    providers: [PexService],
    exports: [PexService]
})
export class PexModule {}
