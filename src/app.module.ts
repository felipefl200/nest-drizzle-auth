import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DrizzleModule } from './drizzle/drizzle.module'
import { PostModule } from './post/post.module'

@Module({
  imports: [DrizzleModule, PostModule, ConfigModule.forRoot({ isGlobal: true })],
  providers: [],
  exports: [],
  controllers: []
})
export class AppModule {}
