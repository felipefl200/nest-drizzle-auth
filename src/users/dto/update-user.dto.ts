import { InferInsertModel } from 'drizzle-orm'
import { users } from 'src/drizzle/schema'

export type UpdateUserDto = Partial<Omit<InferInsertModel<typeof users>, 'id'>>
