import { Test, TestingModule } from '@nestjs/testing';
import { PaymentConfigurationsController } from './payment-configurations.controller';
import { PaymentConfigurationsService } from './payment-configurations.service';

describe('PaymentConfigurationsController', () => {
  let controller: PaymentConfigurationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentConfigurationsController],
      providers: [PaymentConfigurationsService],
    }).compile();

    controller = module.get<PaymentConfigurationsController>(
      PaymentConfigurationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

