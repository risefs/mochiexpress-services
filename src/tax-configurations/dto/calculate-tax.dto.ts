import { IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CalculateTaxDto {
  @ApiProperty({
    example: 42.77,
    description: 'Precio del producto sobre el cual calcular impuestos',
  })
  @IsNumber()
  @Min(0.01, { message: 'Product price must be greater than 0' })
  productPrice!: number;

  @ApiProperty({
    example: 'US',
    description: 'Código ISO del país (2 letras)',
  })
  @IsString()
  countryCode!: string;

  @ApiPropertyOptional({
    example: 'CA',
    description:
      'Código del estado/provincia (opcional, para países como USA, Canada)',
  })
  @IsString()
  @IsOptional()
  stateCode?: string;
}
