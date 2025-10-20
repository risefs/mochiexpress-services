import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { FeeConfiguration } from './entities/fee-configuration.entity';
import { FeeDetailsDto } from '@/pricing/dto/price-breakdown.dto';
import { roundToTwoDecimals } from '@/common/utils/math.utils';

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
  async findByCountryId(countryId: string): Promise<FeeConfiguration | null> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .schema('web_app')
        .from('fee_configurations')
        .select('*')
        .eq('country_id', countryId);

      if (error) {
        this.logger.error('Supabase query error:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }

      return data?.[0] as FeeConfiguration | null;
    } catch (error) {
      this.logger.error('Error in findByCountryId method:', error);
      throw error;
    }
  }

  async calculateTravelerReward(
    productPrice: number,
    countryId: string,
  ): Promise<FeeDetailsDto> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .schema('web_app')
        .from('fee_configurations')
        .select('*')
        .eq('country_id', countryId)
        .eq('fee_type', 'traveler_reward')
        .maybeSingle();

      if (error) {
        this.logger.error('Supabase query error:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }

      if (!data) {
        throw new NotFoundException(
          `Fee configuration not found for country: ${countryId}`,
        );
      }
      const travelerReward = roundToTwoDecimals(
        productPrice * parseFloat(data.fee_rate || '0'),
      );

      return {
        amount: travelerReward,
        rate: parseFloat(data.fee_rate || '0'),
        type: data.fee_type || '',
        calculationMethod: data.calculation_method || '',
        configId: data.id || '',
      };
    } catch (error) {
      this.logger.error('Error in calculateTravelerReward method:', error);
      throw error;
    }
  }

  async calculatePlatformFee(
    productPrice: number,
    countryId: string,
  ): Promise<FeeDetailsDto> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .schema('web_app')
        .from('fee_configurations')
        .select('*')
        .eq('country_id', countryId)
        .eq('fee_type', 'platform_fee')
        .maybeSingle();

      if (error) {
        this.logger.error('Supabase query error:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }

      if (!data) {
        throw new NotFoundException(
          `Fee configuration not found for country: ${countryId}`,
        );
      }
      const platformFee = roundToTwoDecimals(
        productPrice * parseFloat(data.fee_rate || '0'),
      );
      return {
        amount: platformFee,
        rate: parseFloat(data.fee_rate || '0'),
        type: data.fee_type || '',
        calculationMethod: data.calculation_method || '',
        configId: data.id || '',
      };
    } catch (error) {
      this.logger.error('Error in calculatePlatformFee method:', error);
      throw error;
    }
  }
}
