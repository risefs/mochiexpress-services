import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTaxDto {
  @IsUUID()
  @IsNotEmpty()
  country_id!: string;

  @IsString()
  @IsOptional()
  state_code?: string;

  @IsNumber()
  @IsNotEmpty()
  tax_rate!: number;

  @IsString()
  @IsNotEmpty()
  tax_name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsBoolean()
  @IsNotEmpty()
  active!: boolean;

  @IsString()
  @IsNotEmpty()
  valid_from!: string;

  @IsString()
  @IsOptional()
  valid_until!: string;
}
