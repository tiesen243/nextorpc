import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable } from 'drizzle-orm/pg-core'

import { user } from '@/server/db/schema/auth'

export const post = pgTable('Post', (t) => ({
  id: t
    .text('id')
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  title: t.text('title').notNull(),
  content: t.text('content').notNull(),
  authorId: t
    .text('authorId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  createdAt: t.timestamp().defaultNow().notNull(),
}))

export const postRelations = relations(post, ({ one }) => ({
  author: one(user, { fields: [post.authorId], references: [user.id] }),
}))
