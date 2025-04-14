import { Inject, Injectable } from '@nestjs/common'
import { InferSelectModel } from 'drizzle-orm'
import { DrizzleDB } from 'src/drizzle/drizzle.provider'
import { comments, posts, users } from 'src/drizzle/schema'
import { DrizzleDBType } from 'src/drizzle/types/drizzle'
import { CreatePostDto } from './dto/create-post.dto'

type PostWithRelations = InferSelectModel<typeof posts> & {
  author: InferSelectModel<typeof users>
  comments: InferSelectModel<typeof comments>[]
}

@Injectable()
export class PostService {
  constructor(@Inject(DrizzleDB) private readonly db: DrizzleDBType) {}

  async create(createPostDto: CreatePostDto) {
    return await this.db.insert(posts).values(createPostDto).returning()
  }

  async findAll(): Promise<PostWithRelations[]> {
    return await this.db.query.posts.findMany({
      with: {
        author: true,
        comments: true
      }
    })
  }

  // async findOne(id: number) {
  //   return await this.db.query.post.findFirst({
  //     where: (post, { eq }) => eq(post.id, id)
  //   })
  // }

  // update(id: number, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} post`
  // }
}
