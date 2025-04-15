import { InferInsertModel } from 'drizzle-orm'
import { users } from 'src/drizzle/schema'

export type CreateUserDto = Omit<InferInsertModel<typeof users>, 'id'>
