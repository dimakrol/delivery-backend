import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserResolver } from './users.resolver';
import { UserService } from './userService';
import { ConfigService } from '@nestjs/config';
import { Verification } from './entities/verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification]), ConfigService],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UsersModule {}
