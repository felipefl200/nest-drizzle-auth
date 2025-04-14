import { InferInsertModel } from 'drizzle-orm'
import { posts } from 'src/drizzle/schema'

export type CreatePostDto = Omit<InferInsertModel<typeof posts>, 'id'>
