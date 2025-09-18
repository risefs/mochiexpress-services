import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { UsersModule } from './users/users.module';
import { validateConfig } from './config/config.validation';
import { CountryModule } from './country/country.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
      envFilePath: '.env',
    }),
    SupabaseModule,
    UsersModule,
    CountryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
