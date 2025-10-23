import { Test, TestingModule } from '@nestjs/testing';
import { TaxConfigurationsService } from './tax-configurations.service';

describe('TaxConfigurationsService', () => {
  let service: TaxConfigurationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxConfigurationsService],
    }).compile();

    service = module.get<TaxConfigurationsService>(TaxConfigurationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

