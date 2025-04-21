import { Suspense } from 'react'

import { HydrateClient, orpc, prefetch } from '@/lib/orpc/server'
import { PostList } from './page.client'

export default function Home() {
  prefetch(orpc.post.all.queryOptions())

  return (
    <HydrateClient>
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <PostList />
        </Suspense>
      </main>
    </HydrateClient>
  )
}
