'use client'

import type { RouterUtils } from '@orpc/react-query'
import type { RouterClient } from '@orpc/server'
import type { QueryClient } from '@tanstack/react-query'
import { createContext, use, useState } from 'react'
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createORPCReactQueryUtils } from '@orpc/react-query'
import { QueryClientProvider } from '@tanstack/react-query'

import type { AppRouter } from '@/server/api/root'
import { createQueryClient } from '@/lib/orpc/query-client'
import { getBaseUrl } from '@/lib/utils'

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  else return (clientQueryClientSingleton ??= createQueryClient())
}

type ORPCReactUtils = RouterUtils<RouterClient<AppRouter>>

const ORPCContext = createContext<ORPCReactUtils | null>(null)

export function useORPC(): ORPCReactUtils {
  const ctx = use(ORPCContext)
  if (!ctx) throw new Error('ORPCContext is not set up properly')
  return ctx
}

export function ORPCReactProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  const [client] = useState<RouterClient<AppRouter>>(() =>
    createORPCClient(
      new RPCLink({
        url: getBaseUrl() + '/api/orpc',
        headers: {
          'x-orpc-source': 'react-nextjs',
        },
      }),
    ),
  )

  const [orpc] = useState(() =>
    createORPCReactQueryUtils<RouterClient<AppRouter>>(client),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ORPCContext.Provider value={orpc}>{children}</ORPCContext.Provider>
    </QueryClientProvider>
  )
}
