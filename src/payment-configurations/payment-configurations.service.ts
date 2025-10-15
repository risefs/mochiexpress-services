import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PaymentConfigurationsService {
  private readonly logger = new Logger(PaymentConfigurationsService.name);
  constructor(private readonly supabaseService: SupabaseService) {}

  findAll() {
    try {
      this.logger.debug('Querying payment_configurations table from Supabase');
      return this.supabaseService
        .getClient()
        .schema('web_app')
        .from('payment_configurations')
        .select('*');
    } catch (error) {
      this.logger.error('Error in findAll method:', error);
      throw error;
    }
  }

  findOne(id: number) {
    try {
      this.logger.debug('Querying payment_configurations table from Supabase');
      return this.supabaseService
        .getClient()
        .schema('web_app')
        .from('payment_configurations')
        .select('*')
        .eq('id', id);
    } catch (error) {
      this.logger.error('Error in findOne method:', error);
      throw error;
    }
  }
}

