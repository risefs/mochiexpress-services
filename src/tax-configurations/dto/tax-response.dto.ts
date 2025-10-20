import { ApiProperty } from '@nestjs/swagger';

export class TaxResponseDto {
  @ApiProperty({
    example: 3.42,
    description: 'Monto del impuesto calculado',
  })
  taxAmount!: number;

  @ApiProperty({
    example: 0.08,
    description: 'Tasa de impuesto aplicada (0.08 = 8%)',
  })
  taxRate!: number;

  @ApiProperty({
    example: 'Sales Tax',
    description: 'Nombre del impuesto',
  })
  taxName!: string;

  @ApiProperty({
    example: 'uuid-123',
    description: 'ID de la configuración de impuestos utilizada',
  })
  configId!: string;

  @ApiProperty({
    example: 42.77,
    description: 'Precio base sobre el cual se calculó el impuesto',
  })
  baseAmount!: number;

  @ApiProperty({
    example: 'USD',
    description: 'Moneda del cálculo',
  })
  currency!: string;
}
