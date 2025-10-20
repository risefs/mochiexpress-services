import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { UsersModule } from './users/users.module';
import { validateConfig } from './config/config.validation';
import { GrabsModule } from './grabs/grabs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/typeorm.config';
import { CountriesModule } from './countries/countries.module';
import { TaxConfigurationsModule } from './tax-configurations/tax-configurations.module';
import { FeeConfigurationsModule } from './fee-configurations/fee-configurations.module';
import { PaymentConfigurationsModule } from './payment-configurations/payment-configurations.module';
import { PricingModule } from './pricing/pricing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
      envFilePath: process.env.ENV_FILE || '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    SupabaseModule,
    UsersModule,
    GrabsModule,
    CountriesModule,
    TaxConfigurationsModule,
    FeeConfigurationsModule,
    PaymentConfigurationsModule,
    PricingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
