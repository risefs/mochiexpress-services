import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class TaxesService {
  private readonly logger = new Logger(TaxesService.name);
  constructor(private readonly supabaseService: SupabaseService) {}

  findAll() {
    this.logger.debug('Querying taxes table from Supabase');
    return this.supabaseService
      .getClient()
      .schema('web_app')
      .from('taxes')
      .select('*');
  }

  findOne(id: string) {
    this.logger.debug('Querying taxes table from Supabase');
    return this.supabaseService
      .getClient()
      .schema('web_app')
      .from('taxes')
      .select('*')
      .eq('id', id);
  }
}
