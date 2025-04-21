import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import { env } from '@/env'
import * as auth from '@/server/db/schema/auth'
import * as post from '@/server/db/schema/post'

const schema = {
  ...auth,
  ...post,
}

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof neon> | undefined
}

const client = globalForDb.client ?? neon(env.DATABASE_URL)
if (env.NODE_ENV !== 'production') globalForDb.client = client

export const db = drizzle({ client, schema })

export type User = typeof schema.user.$inferInsert
export type Account = typeof schema.account.$inferInsert
export type Session = typeof schema.session.$inferInsert
export type Post = typeof schema.post.$inferInsert
