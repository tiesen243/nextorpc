import { createId } from '@paralleldrive/cuid2'
import { pgTable } from 'drizzle-orm/pg-core'

import { user } from '@/server/db/schema/auth'

export const post = pgTable('Post', (t) => ({
  id: t
    .text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  title: t.text('title').notNull(),
  content: t.text('content').notNull(),
  authorId: t
    .text('authorId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  createdAt: t.timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
}))
