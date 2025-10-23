import { Test, TestingModule } from '@nestjs/testing';
import { FeeConfigurationsService } from './fee-configurations.service';

describe('FeeConfigurationsService', () => {
  let service: FeeConfigurationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeeConfigurationsService],
    }).compile();

    service = module.get<FeeConfigurationsService>(FeeConfigurationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
