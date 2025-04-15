import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { DrizzleModule } from './drizzle/drizzle.module'
import { PostModule } from './posts/post.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [DrizzleModule, PostModule, ConfigModule.forRoot({ isGlobal: true }), AuthModule, UsersModule],
  providers: [],
  exports: [],
  controllers: []
})
export class AppModule {}
