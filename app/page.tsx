import { Suspense } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { HydrateClient, orpc, prefetch } from '@/lib/orpc/server'
import { auth } from '@/server/auth'
import { CreatePost, PostCardSkeleton, PostList } from './page.client'

export default function Home() {
  prefetch(orpc.post.all.queryOptions())

  return (
    <HydrateClient>
      <main className="container max-w-2xl py-4">
        <AuthShowcase />

        <section className="mt-4 flex flex-col gap-4">
          <h2 className="sr-only">Posts List Section</h2>

          <CreatePost />

          <Suspense
            fallback={Array.from({ length: 5 }, (_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          >
            <PostList />
          </Suspense>
        </section>
      </main>
    </HydrateClient>
  )
}

const AuthShowcase: React.FC = async () => {
  const session = await auth()

  return (
    <section className="mt-4 flex flex-col gap-4">
      <h2 className="sr-only">Authenticating Section</h2>

      {!session.user && (
        <Button asChild>
          <Link href="/api/auth/google">Login</Link>
        </Button>
      )}

      {session.user && (
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">
            Welcome, {session.user.name}
          </h3>
          <form action="/api/auth/sign-out" method="POST">
            <Button variant="secondary">Logout</Button>
          </form>
        </div>
      )}
    </section>
  )
}
