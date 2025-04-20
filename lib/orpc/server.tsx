import type { QueryOptionsBase } from '@orpc/react-query'
import { cache } from 'react'
import { headers } from 'next/headers'
import { createRouterUtils } from '@orpc/react-query'
import { createRouterClient } from '@orpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { createQueryClient } from '@/lib/orpc/query-client'
import { createORPCContext } from '@/server/api/orpc'
import { appRouter } from '@/server/api/root'

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers())
  heads.set('x-orpc-source', 'rsc')

  return createORPCContext({ headers: heads })
})

const getQueryClient = cache(createQueryClient)

const orpc = createRouterUtils(
  createRouterClient(appRouter, {
    context: createContext,
  }),
)

function HydrateClient({ children }: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}

function prefetch(queryOptions: QueryOptionsBase<unknown, unknown>) {
  const queryClient = getQueryClient()

  // @ts-expect-error - checking if the queryOptions is infinite or not
  if (queryOptions.queryKey[1]?.type === 'infinite')
    void queryClient.prefetchInfiniteQuery(queryOptions as never)
  else void queryClient.prefetchQuery(queryOptions)
}

export { orpc, HydrateClient, prefetch }
