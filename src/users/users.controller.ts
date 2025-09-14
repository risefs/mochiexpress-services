import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users from Supabase' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [User],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error - connection or credentials issue',
  })
  async findAll(): Promise<User[]> {
    try {
      this.logger.log('Fetching users from Supabase');
      return await this.usersService.findAll();
    } catch (error) {
      this.logger.error('Error fetching users', error);
      throw new HttpException(
        'Failed to fetch users. Please check Supabase connection and credentials.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
