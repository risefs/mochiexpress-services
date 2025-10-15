import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class FeeConfigurationsService {
  private readonly logger = new Logger(FeeConfigurationsService.name);
  constructor(private readonly supabaseService: SupabaseService) {}

  findAll() {
    try {
      this.logger.debug('Querying fee_configurations table from Supabase');
      return this.supabaseService
        .getClient()
        .schema('web_app')
        .from('fee_configurations')
        .select('*');
    } catch (error) {
      this.logger.error('Error in findAll method:', error);
      throw error;
    }
  }

  findOne(id: number) {
    try {
      this.logger.debug('Querying fee_configurations table from Supabase');
      return this.supabaseService
        .getClient()
        .schema('web_app')
        .from('fee_configurations')
        .select('*')
        .eq('id', id);
    } catch (error) {
      this.logger.error('Error in findOne method:', error);
      throw error;
    }
  }
}
