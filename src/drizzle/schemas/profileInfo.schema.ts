import { relations } from 'drizzle-orm'
import { integer, jsonb, pgTable, serial } from 'drizzle-orm/pg-core'
import { users } from './user.schema'

export const profileInfo = pgTable('profile_info', {
  id: serial('id').primaryKey(),
  metadata: jsonb('metadata'),
  userId: integer('userId').references(() => users.id)
})

export const profileInfoRelations = relations(profileInfo, ({ one }) => ({
  user: one(users, {
    fields: [profileInfo.userId],
    references: [users.id]
  })
}))
