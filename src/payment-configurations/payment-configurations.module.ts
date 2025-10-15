import { Module } from '@nestjs/common';
import { SupabaseModule } from '@/supabase/supabase.module';
import { PaymentConfigurationsController } from './payment-configurations.controller';
import { PaymentConfigurationsService } from './payment-configurations.service';

@Module({
  imports: [SupabaseModule],
  controllers: [PaymentConfigurationsController],
  providers: [PaymentConfigurationsService],
  exports: [PaymentConfigurationsService],
})
export class PaymentConfigurationsModule {}
