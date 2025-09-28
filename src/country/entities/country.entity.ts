import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('countries') // Usamos el nombre 'countries' para el mapeo
export class Country {
  @ApiProperty({
    description: 'Unique identifier for the country',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'Country ISO code (e.g., USA, ES)',
    example: 'USA',
  })
  @Column('character', { length: 3, nullable: false })
  iso_code!: string;

  @ApiProperty({
    description: 'Country name',
    example: 'United States',
  })
  @Column('text', { nullable: false })
  name!: string;

  @ApiProperty({
    description: 'Continent name',
    example: 'North America',
    required: false,
  })
  @Column('text', { nullable: true })
  continent?: string;

  @ApiProperty({
    description: 'Currency ISO code (e.g., USD)',
    example: 'USD',
    required: false,
  })
  @Column('character', { length: 3, nullable: true })
  currency_code?: string;

  @ApiProperty({
    description: 'Flag emoji',
    example: '🇺🇸',
    required: false,
  })
  @Column('character', { length: 4, nullable: true })
  flag_emoji?: string;

  @ApiProperty({
    description: 'International phone code (e.g., +1)',
    example: '+1',
    required: false,
  })
  @Column('text', { nullable: true })
  phone_code?: string;

  @ApiProperty({
    description: 'URL to the country flag image',
    example: 'https://cdn.example.com/us.svg',
    required: false,
  })
  @Column('text', { nullable: true })
  flag_image_url?: string;

  @ApiProperty({
    description: 'Timestamp when the country record was created',
    example: '2025-09-28T00:00:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @ApiProperty({
    description: 'Timestamp when the country record was last updated',
    example: '2025-09-28T00:00:00.000Z',
    required: false,
  })
  @UpdateDateColumn({ type: 'timestamptz', select: false })
  updated_at!: Date;
}
