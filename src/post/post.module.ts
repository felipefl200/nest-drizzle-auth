import { Module } from '@nestjs/common'
import { DrizzleModule } from 'src/drizzle/drizzle.module'
import { PostController } from './post.controller'
import { PostService } from './post.service'

@Module({
  imports: [DrizzleModule],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
