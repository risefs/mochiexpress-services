import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Country } from '../../countries/entities/country.entity';

@Entity({ schema: 'web_app', name: 'payment_configurations' })
export class PaymentConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  provider!: string;

  @Column({ type: 'uuid' })
  country_id!: string;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  country!: Country;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fixed_fee!: string;

  @Column({ type: 'decimal', precision: 5, scale: 4 })
  percentage_fee!: string;

  @Column({ type: 'varchar', length: 50 })
  payment_method!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  min_fee!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  max_fee!: string | null;

  @Column({ type: 'boolean', default: true })
  supports_refunds!: boolean;

  @Column({ type: 'boolean', default: false })
  supports_installments!: boolean;

  @Column({ type: 'int', nullable: true })
  max_installments!: number | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  api_version!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @Column({ type: 'timestamp', default: () => 'now()' })
  valid_from!: Date;

  @Column({ type: 'timestamp', nullable: true })
  valid_until!: Date | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'now()' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'now()' })
  updated_at!: Date;
}
