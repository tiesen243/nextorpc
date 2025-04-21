'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'

import type { SessionResult } from '@/server/auth/core/session'

interface SessionContextValue {
  session: SessionResult
  isLoading: boolean
  signOut: () => Promise<void>
}

const SessionContext = React.createContext<SessionContextValue | undefined>(
  undefined,
)

export function useSession() {
  const ctx = React.useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within a SessionProvider')
  return ctx
}

export function SessionProvider(
  props: Readonly<{ children: React.ReactNode; session?: SessionResult }>,
) {
  const {
    data: session = { expires: new Date() },
    isLoading,
    refetch,
  } = useQuery<SessionResult>({
    queryKey: ['session'],
    queryFn: () => fetch('/api/auth').then((res) => res.json()),
    initialData: props.session,
  })

  const signOut = React.useCallback(async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' })
    await refetch()
  }, [refetch])

  const value = React.useMemo(
    () =>
      ({
        session,
        isLoading,
        signOut,
      }) satisfies SessionContextValue,
    [session, isLoading, signOut],
  )

  return <SessionContext value={value}>{props.children}</SessionContext>
}
