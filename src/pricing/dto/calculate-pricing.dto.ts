import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CalculatePricingDto {
  @ApiProperty({
    example: 42.77,
    description: 'Precio del producto',
  })
  @IsNumber()
  @Min(0.01)
  productPrice!: number;

  @ApiPropertyOptional({
    example: 'US',
    description: 'Código ISO del país (2 letras)',
    default: 'US',
  })
  @IsString()
  @IsOptional()
  countryCode?: string = 'US';

  @ApiPropertyOptional({
    example: 'CA',
    description: 'Código del estado (solo para USA, Canada, etc.)',
  })
  @IsString()
  @IsOptional()
  stateCode?: string;

  @ApiPropertyOptional({
    example: 'stripe',
    description: 'Proveedor de procesamiento de pagos',
    default: 'stripe',
  })
  @IsString()
  @IsOptional()
  paymentProvider?: string = 'stripe';
}
