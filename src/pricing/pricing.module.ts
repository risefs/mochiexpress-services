import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { TaxConfigurationsModule } from '@/tax-configurations/tax-configurations.module';
import { FeeConfigurationsModule } from '@/fee-configurations/fee-configurations.module';
import { PaymentConfigurationsModule } from '@/payment-configurations/payment-configurations.module';
import { CountriesModule } from '@/countries/countries.module';
import { SupabaseModule } from '@/supabase/supabase.module';

@Module({
  imports: [
    TaxConfigurationsModule,
    FeeConfigurationsModule,
    PaymentConfigurationsModule,
    CountriesModule,
    SupabaseModule,
  ],
  controllers: [PricingController],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}
