import type { Config } from 'drizzle-kit'

import { env } from './env'

export default {
  dialect: 'postgresql',
  schema: './server/db/schema',
  dbCredentials: { url: env.DATABASE_URL.replace('-pooler', '') },
} satisfies Config
