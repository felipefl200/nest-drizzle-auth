import { relations } from 'drizzle-orm'
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { comments } from './comment.schema'
import { posts } from './post.schema'
import { profileInfo } from './profileInfo.schema'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  deletedAt: timestamp('deletedAt')
})

export const userRelations = relations(users, ({ one, many }) => ({
  posts: many(posts),
  comments: many(comments),
  profileInfo: one(profileInfo, {
    fields: [users.id],
    references: [profileInfo.userId]
  })
}))
