import { CountriesService } from '@/countries/countries.service';
import { FeeConfigurationsService } from '@/fee-configurations/fee-configurations.service';
import { PaymentConfigurationsService } from '@/payment-configurations/payment-configurations.service';
import { TaxConfigurationsService } from '@/tax-configurations/tax-configurations.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PriceBreakdownDto } from './dto/price-breakdown.dto';
import { CalculatePricingDto } from './dto/calculate-pricing.dto';
import { roundToTwoDecimals } from '@/common/utils/math.utils';

@Injectable()
export class PricingService {
  private readonly logger = new Logger(PricingService.name);

  constructor(
    private readonly taxConfigurationsService: TaxConfigurationsService,
    private readonly feeConfigurationsService: FeeConfigurationsService,
    private readonly paymentConfigurationsService: PaymentConfigurationsService,
    private readonly countriesService: CountriesService,
  ) {}

  async calculatePriceBreakdown(
    dto: CalculatePricingDto,
  ): Promise<PriceBreakdownDto> {
    const countryCode = dto.countryCode || 'US';
    const paymentProvider = dto.paymentProvider || 'stripe';
    // const currency = dto.currency || 'USD';

    this.logger.log(
      `Calculating price breakdown: $${dto.productPrice} for ${countryCode}${dto.stateCode ? `/${dto.stateCode}` : ''}`,
    );

    try {
      // Validate and get country
      const country = await this.countriesService.findByIsoCode(countryCode);
      if (!country) {
        throw new NotFoundException(`Country not found: ${countryCode}`);
      }

      // Execute pricing calculations parallelly
      const [taxResult, travelerRewardResult, platformFeeResult] =
        await Promise.all([
          // Calculate tax
          this.taxConfigurationsService.calculateTax({
            productPrice: dto.productPrice,
            countryCode: countryCode,
            stateCode: dto.stateCode,
          }),
          // Calculate traveler reward
          this.feeConfigurationsService.calculateTravelerReward(
            dto.productPrice,
            country.id,
          ),
          // Calculate platform fee
          this.feeConfigurationsService.calculatePlatformFee(
            dto.productPrice,
            country.id,
          ),
        ]);

      const subtotal = roundToTwoDecimals(
        dto.productPrice +
          taxResult.taxAmount +
          travelerRewardResult.amount +
          platformFeeResult.amount,
      );

      const paymentProcessingResult =
        await this.paymentConfigurationsService.calculatePaymentProcessing(
          subtotal,
          country.id,
        );

      console.log('paymentProcessingResult', paymentProcessingResult);

      const breakdown: PriceBreakdownDto = {
        productPrice: dto.productPrice,
        tax: {
          amount: taxResult.taxAmount,
          rate: taxResult.taxRate,
          name: taxResult.taxName,
          configId: taxResult.configId,
        },
        travelerReward: {
          amount: travelerRewardResult.amount,
          rate: travelerRewardResult.rate,
          type: travelerRewardResult.type,
          calculationMethod: travelerRewardResult.calculationMethod,
          configId: travelerRewardResult.configId,
        },
        platformFee: {
          amount: platformFeeResult.amount,
          rate: platformFeeResult.rate,
          type: platformFeeResult.type,
          calculationMethod: platformFeeResult.calculationMethod,
          configId: platformFeeResult.configId,
        },
        paymentProcessing: {
          amount: paymentProcessingResult.amount,
          fixedFee: paymentProcessingResult.fixedFee,
          percentageFee: paymentProcessingResult.percentageFee,
          provider: paymentProcessingResult.provider,
          configId: paymentProcessingResult.configId,
        },
        subtotal,
        total: subtotal + paymentProcessingResult.amount,
        currency: 'USD',
        countryCode,
        calculatedAt: new Date().toISOString(),
      };

      return breakdown;
    } catch (error) {
      this.logger.error('Error in calculatePriceBreakdown method:', error);
      throw error;
    }
  }
}
