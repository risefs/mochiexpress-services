import { Module } from '@nestjs/common';
import { GrabsService } from './grabs.service';
import { GrabsController } from './grabs.controller';
import { SupabaseModule } from '@/supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [GrabsController],
  providers: [GrabsService],
  exports: [GrabsService],
})
export class GrabsModule {}
