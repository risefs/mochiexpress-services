import { Module } from '@nestjs/common';
import { TaxConfigurationsService } from './tax-configurations.service';
import { TaxConfigurationsController } from './tax-configurations.controller';
import { SupabaseModule } from '@/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [TaxConfigurationsController],
  providers: [TaxConfigurationsService],
  exports: [TaxConfigurationsService],
})
export class TaxConfigurationsModule {}

