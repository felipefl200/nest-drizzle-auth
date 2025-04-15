import { Module } from '@nestjs/common'
import { CommonModule } from 'src/common/common.module'
import { DrizzleModule } from 'src/drizzle/drizzle.module'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [DrizzleModule, CommonModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
