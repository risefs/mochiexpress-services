import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('countries', { schema: 'web_app' })
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'char', length: 2, unique: true })
  iso_code!: string;

  @Column('text')
  name!: string;

  @Column('text', { nullable: true })
  continent!: string;

  @Column({ type: 'char', length: 3, nullable: true })
  currency_code!: string;

  @Column({ type: 'char', length: 2, nullable: true })
  flag_emoji!: string;

  @Column('text', { nullable: true })
  phone_code!: string;

  @Column('text', { default: 'https://flagcdn.com/w80/{code}.png' })
  flag_image_url!: string;

  @CreateDateColumn()
  created_at!: Date;
}
