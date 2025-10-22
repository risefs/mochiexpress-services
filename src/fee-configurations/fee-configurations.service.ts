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

      let amount = 0;

      switch (data.calculation_method) {
        case 'percentage':
          amount = productPrice * parseFloat(data.fee_rate || '0');
          break;

        case 'fixed':
          amount = parseFloat(data.fixed_amount || '0');
          break;

        case 'percentage_plus_fixed':
          amount =
            productPrice * parseFloat(data.fee_rate || '0') +
            parseFloat(data.fixed_amount || '0');
          break;
      }

      // Apply limits
      if (data.min_amount) {
        amount = Math.max(amount, parseFloat(data.min_amount));
      }
      if (data.max_amount) {
        amount = Math.min(amount, parseFloat(data.max_amount));
      }

      const travelerReward = roundToTwoDecimals(amount);

      this.logger.debug(
        `Traveler reward calculated: $${productPrice} * ${data.fee_rate || '0'} = $${travelerReward} (${data.fee_type})`,
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

      let amount = 0;

      switch (data.calculation_method) {
        case 'percentage':
          amount = productPrice * parseFloat(data.fee_rate || '0');
          break;

        case 'fixed':
          amount = parseFloat(data.fixed_amount || '0');
          break;
      }

      // Apply limits
      if (data.min_amount) {
        amount = Math.max(amount, parseFloat(data.min_amount));
      }
      if (data.max_amount) {
        amount = Math.min(amount, parseFloat(data.max_amount));
      }

      const platformFee = roundToTwoDecimals(amount);

      this.logger.debug(
        `Platform fee calculated: $${productPrice} * ${data.fee_rate || '0'} = $${platformFee} (${data.fee_type})`,
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
