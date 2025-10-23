import { Test, TestingModule } from '@nestjs/testing';
import { FeeConfigurationsController } from './fee-configurations.controller';
import { FeeConfigurationsService } from './fee-configurations.service';

describe('FeeConfigurationsController', () => {
  let controller: FeeConfigurationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeeConfigurationsController],
      providers: [FeeConfigurationsService],
    }).compile();

    controller = module.get<FeeConfigurationsController>(
      FeeConfigurationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
