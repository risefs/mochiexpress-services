import { Test, TestingModule } from '@nestjs/testing';
import { TaxConfigurationsController } from './tax-configurations.controller';
import { TaxConfigurationsService } from './tax-configurations.service';

describe('TaxConfigurationsController', () => {
  let controller: TaxConfigurationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxConfigurationsController],
      providers: [TaxConfigurationsService],
    }).compile();

    controller = module.get<TaxConfigurationsController>(TaxConfigurationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

