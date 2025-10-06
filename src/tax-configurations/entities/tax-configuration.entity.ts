import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tax_configurations', { schema: 'web_app' })
export class TaxConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  country_id!: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  state_code?: string;

  @Column({ type: 'decimal', precision: 5, scale: 4 })
  tax_rate!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tax_name?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @Column({ type: 'text' })
  valid_from!: string;

  @Column({ type: 'text', nullable: true })
  valid_until?: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  updated_at!: Date;
}

