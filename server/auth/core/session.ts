import { sha256 } from '@oslojs/crypto/sha2'
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from '@oslojs/encoding'
import { eq } from 'drizzle-orm'

import type { User } from '@/server/db'
import { db } from '@/server/db'
import { session as sessionTable } from '@/server/db/schema/auth'

export class Session {
  private readonly db: typeof db
  private readonly EXPIRATION_TIME

  constructor() {
    this.EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30 // 30 days

    this.db = db
  }

  private generateSessionToken(): string {
    const bytes = new Uint8Array(20)
    crypto.getRandomValues(bytes)
    const token = encodeBase32LowerCaseNoPadding(bytes)
    return token
  }

  public async createSession(
    userId: string,
  ): Promise<{ sessionToken: string; expires: Date }> {
    const token = this.generateSessionToken()

    const s = await this.db
      .insert(sessionTable)
      .values({
        sessionToken: encodeHexLowerCase(
          sha256(new TextEncoder().encode(token)),
        ),
        expires: new Date(Date.now() + this.EXPIRATION_TIME),
        userId,
      })
      .returning()

    return { sessionToken: token, expires: s.at(0)?.expires ?? new Date() }
  }

  public async validateSessionToken(token: string): Promise<SessionResult> {
    const sessionToken = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    )

    const session = await this.db.query.session.findFirst({
      where: (session, { eq }) => eq(session.sessionToken, sessionToken),
    })

    const user = await this.db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, session?.userId ?? ''),
    })

    if (!session) return { expires: new Date() }

    if (Date.now() > session.expires.getTime()) {
      await this.db
        .delete(sessionTable)
        .where(eq(sessionTable.sessionToken, sessionToken))
      return { expires: new Date() }
    }

    if (Date.now() >= session.expires.getTime() - this.EXPIRATION_TIME / 2) {
      session.expires = new Date(Date.now() + this.EXPIRATION_TIME)
      await this.db
        .update(sessionTable)
        .set({ expires: session.expires })
        .where(eq(sessionTable.sessionToken, sessionToken))
    }

    return { user, expires: session.expires }
  }

  public async invalidateSessionToken(token: string): Promise<void> {
    const sessionToken = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    )
    await this.db
      .delete(sessionTable)
      .where(eq(sessionTable.sessionToken, sessionToken))
  }

  public async invalidateAllSessionTokens(userId: string): Promise<void> {
    await this.db.delete(sessionTable).where(eq(sessionTable.userId, userId))
  }
}

export interface SessionResult {
  user?: User
  expires: Date
}
