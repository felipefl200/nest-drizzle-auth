import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { users } from './user.schema'
import { posts } from './post.schema'

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  authorId: integer('authorId')
    .references(() => users.id)
    .notNull(),
  postId: integer('postId')
    .references(() => posts.id)
    .notNull()
})
