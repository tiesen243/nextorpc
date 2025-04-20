import { createId } from '@paralleldrive/cuid2'
import { pgTable, primaryKey, uniqueIndex } from 'drizzle-orm/pg-core'

export const user = pgTable(
  'User',
  (t) => ({
    id: t
      .text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    name: t.text('name').notNull(),
    email: t.text('email').notNull(),
    image: t.text('image').notNull(),
    password: t.text('password'),
    createdAt: t
      .timestamp('createdAt', { precision: 3 })
      .notNull()
      .defaultNow(),
    updatedAt: t.timestamp('updatedAt', { precision: 3 }).notNull(),
  }),
  (t) => [uniqueIndex('User_email_key').on(t.email)],
)

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
    createdAt: t
      .timestamp('createdAt', { precision: 3 })
      .notNull()
      .defaultNow(),
    updatedAt: t.timestamp('updatedAt', { precision: 3 }).notNull(),
  }),
  (t) => [
    primaryKey({
      columns: [t.provider, t.providerAccountId],
      name: 'Account_pkey',
    }),
  ],
)

export const session = pgTable('Session', (t) => ({
  sessionToken: t.text('sessionToken').primaryKey(),
  expires: t.timestamp('expires', { precision: 3 }).notNull(),
  userId: t
    .text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
}))
