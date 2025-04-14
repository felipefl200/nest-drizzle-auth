import { Inject, Injectable } from '@nestjs/common'
import { eq, InferSelectModel, isNull } from 'drizzle-orm'
import { DrizzleDB } from 'src/drizzle/drizzle.provider'
import { comments, posts, users } from 'src/drizzle/schema'
import { DrizzleDBType } from 'src/drizzle/types/drizzle'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

type PostWithRelations = InferSelectModel<typeof posts> & {
  author?: InferSelectModel<typeof users>
  comments?: InferSelectModel<typeof comments>[]
}

@Injectable()
export class PostService {
  constructor(@Inject(DrizzleDB) private readonly db: DrizzleDBType) {}

  // // Função auxiliar para filtrar itens não excluídos
  // private isNotDeleted(posts: any) {
  //   return isNull(posts.deletedAt)
  // }

  async create(createPostDto: CreatePostDto) {
    return await this.db.insert(posts).values(createPostDto).returning()
  }

  async findAll(): Promise<PostWithRelations[]> {
    return await this.db.query.posts.findMany({
      orderBy: (posts) => posts.id,
      where: (posts) => isNull(posts.deletedAt),
      with: {
        author: true,
        comments: true
      }
    })
  }

  async findOne(id: number): Promise<PostWithRelations | null> {
    const post = await this.db.query.posts.findFirst({
      where: (posts, { eq, and }) => and(eq(posts.id, id), isNull(posts.deletedAt)),
      with: {
        author: true,
        comments: true
      }
    })

    if (!post) return null
    return post
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<InferSelectModel<typeof posts> | null> {
    const updatedPosts = await this.db.update(posts).set(updatePostDto).where(eq(posts.id, id)).returning()

    if (updatedPosts.length === 0) {
      return null
    }

    return updatedPosts[0]
  }

  async remove(id: number) {
    const deletedPosts = await this.db.update(posts).set({ deletedAt: new Date() }).where(eq(posts.id, id)).returning()

    if (deletedPosts.length === 0) return null

    return deletedPosts[0]
  }

  async hardRemove(id: number) {
    const post = await this.db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id)
    })

    if (!post) {
      return null
    }

    return await this.db.transaction(async (tx) => {
      // Exclui os comentários
      await tx.delete(comments).where(eq(comments.postId, id))

      // Exclui o post
      const deletedPosts = await tx.delete(posts).where(eq(posts.id, id)).returning()

      if (deletedPosts.length === 0) {
        return null
      }

      return deletedPosts[0]
    })
  }
}
