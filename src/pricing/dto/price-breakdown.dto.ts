import { ApiProperty } from '@nestjs/swagger';

export class TaxDetailsDto {
  @ApiProperty({ example: 3.42 })
  amount!: number;

  @ApiProperty({ example: 0.08 })
  rate!: number;

  @ApiProperty({ example: 'Sales Tax' })
  name!: string;

  @ApiProperty({ example: 'uuid-123' })
  configId!: string;
}

export class FeeDetailsDto {
  @ApiProperty({ example: 11.76 })
  amount!: number;

  @ApiProperty({ example: 0.275 })
  rate?: number;

  @ApiProperty({ example: 'traveler_reward' })
  type!: string;

  @ApiProperty({ example: 'percentage' })
  calculationMethod!: string;

  @ApiProperty({ example: 'uuid-456' })
  configId!: string;
}

export class PaymentProcessingDetailsDto {
  @ApiProperty({ example: 3.34 })
  amount!: number;

  @ApiProperty({ example: 0.3 })
  fixedFee!: number;

  @ApiProperty({ example: 0.029 })
  percentageFee!: number;

  @ApiProperty({ example: 'stripe' })
  provider!: string;

  @ApiProperty({ example: 'uuid-789' })
  configId!: string;
}

export class PriceBreakdownDto {
  @ApiProperty({ example: 42.77 })
  productPrice!: number;

  @ApiProperty({ type: TaxDetailsDto })
  tax!: TaxDetailsDto;

  @ApiProperty({ type: FeeDetailsDto })
  travelerReward!: FeeDetailsDto;

  @ApiProperty({ type: FeeDetailsDto })
  platformFee!: FeeDetailsDto;

  @ApiProperty({ type: PaymentProcessingDetailsDto })
  paymentProcessing!: PaymentProcessingDetailsDto;

  @ApiProperty({ example: 63.51 })
  subtotal!: number;

  @ApiProperty({ example: 66.85 })
  total!: number;

  @ApiProperty({ example: 'USD' })
  currency!: string;

  @ApiProperty({ example: 'US' })
  countryCode!: string;

  @ApiProperty({ example: '2025-10-16T10:30:00Z' })
  calculatedAt!: string;
}
