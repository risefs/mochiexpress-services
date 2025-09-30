import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsUrl,
  IsDateString,
} from 'class-validator';

export class CreateGrabDto {
  @IsUUID()
  @IsNotEmpty()
  user_id!: string;

  @IsUrl()
  @IsNotEmpty()
  product_url!: string;

  @IsString()
  @IsNotEmpty()
  product_title!: string;

  @IsNumber()
  @IsNotEmpty()
  price_estimated!: number;

  @IsNumber()
  @IsNotEmpty()
  quantity!: number;

  @IsString()
  description!: string;

  @IsBoolean()
  @IsNotEmpty()
  has_original_packaging!: boolean;

  @IsUUID()
  @IsNotEmpty()
  country_origin_id!: string;

  @IsUUID()
  @IsNotEmpty()
  country_destination_id!: string;

  @IsDateString()
  @IsNotEmpty()
  delivery_deadline!: string;

  @IsOptional()
  @IsString()
  product_image?: string;
}
