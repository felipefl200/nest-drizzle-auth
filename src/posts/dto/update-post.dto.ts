import { InferInsertModel } from 'drizzle-orm'
import { posts } from 'src/drizzle/schema'

export type UpdatePostDto = Partial<Omit<InferInsertModel<typeof posts>, 'id'>>
