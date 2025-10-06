import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class TaxConfigurationsService {
  private readonly logger = new Logger(TaxConfigurationsService.name);
  constructor(private readonly supabaseService: SupabaseService) {}

  findAll() {
    this.logger.debug('Querying tax_configurations table from Supabase');
    return this.supabaseService
      .getClient()
      .schema('web_app')
      .from('tax_configurations')
      .select('*');
  }

  findOne(id: string) {
    this.logger.debug('Querying tax_configurations table from Supabase');
    return this.supabaseService
      .getClient()
      .schema('web_app')
      .from('tax_configurations')
      .select('*')
      .eq('id', id);
  }
}

