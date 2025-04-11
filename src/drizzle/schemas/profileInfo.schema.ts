import { integer, jsonb, pgTable, serial } from 'drizzle-orm/pg-core'
import { users } from './user.schema'

export const profileInfo = pgTable('profile_info', {
  id: serial('id').primaryKey(),
  metadata: jsonb('metadata'),
  userId: integer('userId').references(() => users.id)
})
