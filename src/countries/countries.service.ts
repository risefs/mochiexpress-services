import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {
  private readonly logger = new Logger(CountriesService.name);
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Country[]> {
    try {
      this.logger.debug('Querying countries table from Supabase');

      const { data, error } = await this.supabaseService
        .getClient()
        .schema('web_app')
        .from('countries')
        .select('*');

      if (error) {
        this.logger.error('Supabase query error:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }

      this.logger.debug(`Retrieved ${data?.length || 0} countries`);

      return data as Country[];
    } catch (error) {
      this.logger.error('Error in findAll method:', error);
      throw error;
    }
  }

  async findByIsoCode(isoCode: string): Promise<Country | null> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .schema('web_app')
        .from('countries')
        .select('*')
        .eq('iso_code', isoCode);

      if (error) {
        this.logger.error('Supabase query error:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }

      return data?.[0] as Country;
    } catch (error) {
      this.logger.error('Error in findByIsoCode method:', error);
      throw error;
    }
  }
}
