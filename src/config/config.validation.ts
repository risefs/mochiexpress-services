import { plainToClass } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  validateSync,
  IsNumberString,
} from 'class-validator';

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  SUPABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  SUPABASE_SERVICE_ROLE!: string;

  // TypeORM Database Configuration
  @IsString()
  @IsNotEmpty()
  DATABASE_HOST!: string;

  @IsNumberString()
  @IsNotEmpty()
  DATABASE_PORT!: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_USERNAME!: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_NAME!: string;

  @IsOptional()
  @IsString()
  NODE_ENV?: string = 'development';

  @IsOptional()
  @IsString()
  PORT?: string = '3000';
}

export function validateConfig(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => Object.values(error.constraints || {}))
      .flat()
      .join(', ');

    throw new Error(`❌ Configuration validation failed: ${errorMessages}`);
  }

  return validatedConfig;
}
