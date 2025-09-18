import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  id!: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    required: false,
  })
  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Timestamp when the user was created',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  created_at?: string;

  @ApiProperty({
    description: 'Timestamp when the user was last updated',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  updated_at?: string;
}
