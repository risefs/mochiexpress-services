import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { userProviders } from './user.provider';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UserService, UserService],
  controllers: [UsersController],
  exports: [UserService],
})
export class UsersModule {}
