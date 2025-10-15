import { Module } from '@nestjs/common';
import { FeeConfigurationsService } from './fee-configurations.service';
import { FeeConfigurationsController } from './fee-configurations.controller';
import { SupabaseModule } from '@/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [FeeConfigurationsController],
  providers: [FeeConfigurationsService],
  exports: [FeeConfigurationsService],
})
export class FeeConfigurationsModule {}
