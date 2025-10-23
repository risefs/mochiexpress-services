import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { TaxConfiguration } from './entities/tax-configuration.entity';
import { TaxResponseDto } from './dto/tax-response.dto';
import { CalculateTaxDto } from './dto/calculate-tax.dto';
import { CountriesService } from '@/countries/countries.service';
import { roundToTwoDecimals } from '@/common/utils/math.utils';

@Injectable()
export class TaxConfigurationsService {
  private readonly logger = new Logger(TaxConfigurationsService.name);
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly countriesService: CountriesService,
  ) {}

  findAll() {
    this.logger.debug('Querying tax_configurations table from Supabase');
    return this.supabaseService
      .getClient()
      .schema('web_app')
      .from('tax_configurations')
      .select('*');
  }

  findOne(id: string) {
    this.logger.debug('Querying tax_configurations table from Supabase');
    return this.supabaseService
      .getClient()
      .schema('web_app')
      .from('tax_configurations')
      .select('*')
      .eq('id', id);
  }

  async findByCountryId(countryId: string): Promise<TaxConfiguration | null> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .schema('web_app')
        .from('tax_configurations')
        .select('*')
        .eq('country_id', countryId);

      if (error) {
        this.logger.error('Supabase query error:', error);
        throw new Error(`Database query failed: ${error.message}`);
      }

      return data?.[0] as TaxConfiguration;
    } catch (error) {
      this.logger.error('Error in findByCountryId method:', error);
      throw error;
    }
  }

  async calculateTax(dto: CalculateTaxDto): Promise<TaxResponseDto> {
    this.logger.log(
      `Calculating tax for ${dto.countryCode}${dto.stateCode ? `/${dto.stateCode}` : ''}, price: $${dto.productPrice}`,
    );

    try {
      const country = await this.countriesService.findByIsoCode(
        dto.countryCode,
      );
      if (!country) {
        throw new NotFoundException(`Country not found: ${dto.countryCode}`);
      }
      const config = await this.getActiveTaxConfig(country.id, dto.stateCode);

      const taxAmount = roundToTwoDecimals(
        dto.productPrice * parseFloat(config.tax_rate),
      );

      this.logger.debug(
        `Tax calculated: $${dto.productPrice} * ${config.tax_rate} = $${taxAmount} (${config.tax_name})`,
      );

      return {
        taxAmount: taxAmount,
        taxRate: parseFloat(config.tax_rate),
        taxName: config.tax_name || '',
        configId: config.id,
        baseAmount: dto.productPrice,
        currency: country.currency_code || 'USD',
      };
    } catch (error) {
      this.logger.error('Error in calculateTax method:', error);
      throw error;
    }
  }

  /**
   * Obtener configuración de impuestos activa
   * Busca primero por estado (si aplica), sino usa configuración nacional
   */
  async getActiveTaxConfig(
    countryId: string,
    stateCode?: string,
  ): Promise<TaxConfiguration> {
    const supabase = this.supabaseService.getClient();

    try {
      let query = supabase
        .schema('web_app')
        .from('tax_configurations')
        .select('*')
        .eq('country_id', countryId)
        .eq('active', true);

      // Agregar filtro de fecha válida
      const now = new Date().toISOString();
      query = query
        .lte('valid_from', now)
        .or(`valid_until.is.null,valid_until.gte.${now}`);

      // Si hay stateCode, buscar configuración específica del estado
      if (stateCode) {
        const stateQuery = query.eq('state_code', stateCode);
        const { data: stateData, error: stateError } =
          await stateQuery.maybeSingle();

        // Si encontró config de estado, retornarla
        if (stateData && !stateError) {
          this.logger.debug(`Found state-specific tax config for ${stateCode}`);
          return stateData as TaxConfiguration;
        }

        // Si no encontró config de estado, buscar nacional (fallback)
        this.logger.debug(
          `No state-specific config found for ${stateCode}, using national config`,
        );
      }

      // Buscar configuración nacional (state_code = null)
      const nationalQuery = query.is('state_code', null);
      const { data, error } = await nationalQuery.maybeSingle();

      if (error || !data) {
        this.logger.error(
          `Tax configuration not found for country_id: ${countryId}`,
          error,
        );
        throw new NotFoundException(
          `Tax configuration not found. Please ensure tax rates are configured for this country.`,
        );
      }

      this.logger.debug('Using national tax configuration');
      return data as TaxConfiguration;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error('Database error while fetching tax config', error);
      throw new BadRequestException('Failed to fetch tax configuration');
    }
  }
}
