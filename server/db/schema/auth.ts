import { createId } from '@paralleldrive/cuid2'
import { relations, sql } from 'drizzle-orm'
import { pgTable, primaryKey, uniqueIndex } from 'drizzle-orm/pg-core'

import { post } from '@/server/db/schema/post'

export const user = pgTable(
  'User',
  (t) => ({
    id: t
      .text('id')
      .$defaultFn(() => createId())
      .notNull()
      .primaryKey(),
    name: t.text('name').notNull(),
    email: t.text('email').notNull(),
    image: t.text('image').notNull(),
    password: t.text('password'),
    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .$onUpdateFn(() => sql`now()`),
  }),
  (t) => [uniqueIndex('User_email_key').on(t.email)],
)

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
  posts: many(post),
}))

export const account = pgTable(
  'Account',
  (t) => ({
    provider: t.text('provider').notNull(),
    providerAccountId: t.text('providerAccountId').notNull(),
    providerAccountName: t.text('providerAccountName').notNull(),
    userId: t
      .text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .$onUpdateFn(() => sql`now()`),
  }),
  (t) => [
    primaryKey({
      columns: [t.provider, t.providerAccountId],
      name: 'Account_pkey',
    }),
  ],
)

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}))

export const session = pgTable('Session', (t) => ({
  sessionToken: t.text('sessionToken').primaryKey(),
  expires: t.timestamp('expires', { precision: 3 }).notNull(),
  userId: t
    .text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}))
