import { Test, TestingModule } from '@nestjs/testing';
import { PaymentConfigurationsService } from './payment-configurations.service';

describe('PaymentConfigurationsService', () => {
  let service: PaymentConfigurationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentConfigurationsService],
    }).compile();

    service = module.get<PaymentConfigurationsService>(
      PaymentConfigurationsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

