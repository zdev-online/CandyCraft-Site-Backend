import { Test, TestingModule } from '@nestjs/testing';
import { PexService } from './pex.service';

describe('PexService', () => {
  let service: PexService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PexService],
    }).compile();

    service = module.get<PexService>(PexService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
