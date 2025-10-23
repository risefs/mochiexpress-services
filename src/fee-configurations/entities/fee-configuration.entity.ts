import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'web_app', name: 'fee_configurations' })
export class FeeConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  fee_type!: string;

  @Column({ type: 'uuid', nullable: true })
  country_id!: string | null;

  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  fee_rate!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fixed_amount!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  min_amount!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  max_amount!: string | null;

  @Column({ type: 'varchar', length: 20, default: 'percentage' })
  calculation_method!: string;

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
