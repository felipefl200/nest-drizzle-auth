import { index, integer, pgEnum, pgTable, primaryKey, serial, text } from 'drizzle-orm/pg-core'
import { users } from './user.schema'

export const groupRoleEnum = pgEnum('roles', ['admin', 'user', 'moderator'])

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  role: groupRoleEnum('role').default('user')
})

export const groupMembers = pgTable(
  'group_members',
  {
    groupId: integer('groupId')
      .references(() => groups.id)
      .notNull(),
    userId: integer('userId')
      .references(() => users.id)
      .notNull()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.groupId, table.userId] }),
    userIdIndex: index('userIdIndex').on(table.userId)
  })
)
