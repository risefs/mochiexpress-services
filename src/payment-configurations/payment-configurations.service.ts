import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PaymentConfiguration } from './entities/payment-configurations';
import { PaymentProcessingDetailsDto } from '@/pricing/dto/price-breakdown.dto';
import { roundToTwoDecimals } from '@/common/utils/math.utils';

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

  async findByCountryId(
    countryId: string,
  ): Promise<PaymentConfiguration | null> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .schema('web_app')
        .from('payment_configurations')
        .select('*')
        .eq('country_id', countryId);
      if (error) {
        this.logger.error('Supabase query error:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }

      return data?.[0] as PaymentConfiguration | null;
    } catch (error) {
      this.logger.error('Error in findByCountryId method:', error);
      throw error;
    }
  }

  async findByProvider(provider: string): Promise<PaymentConfiguration | null> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .schema('web_app')
        .from('payment_configurations')
        .select('*')
        .eq('provider', provider)
        .maybeSingle();
      if (error) {
        this.logger.error('Supabase query error:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }

      return data as PaymentConfiguration | null;
    } catch (error) {
      this.logger.error('Error in findByProvider method:', error);
      throw error;
    }
  }

  async calculatePaymentProcessing(
    productPrice: number,
    provider: string,
  ): Promise<PaymentProcessingDetailsDto> {
    try {
      const paymentConfig = await this.findByProvider(provider);
      if (!paymentConfig) {
        throw new NotFoundException(
          `Payment configuration not found for provider: ${provider}`,
        );
      }
      const amount = roundToTwoDecimals(
        productPrice * parseFloat(paymentConfig.percentage_fee || '0'),
      );
      return {
        amount: amount,
        fixedFee: parseFloat(paymentConfig.fixed_fee || '0'),
        percentageFee: parseFloat(paymentConfig.percentage_fee || '0'),
        provider: paymentConfig.provider,
        configId: paymentConfig.id || '',
      };
    } catch (error) {
      this.logger.error('Error in calculatePaymentProcessing method:', error);
      throw error;
    }
  }
}
