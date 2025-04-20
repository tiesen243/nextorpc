'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { useORPC } from '@/lib/orpc/react'

export const PostList: React.FC = () => {
  const orpc = useORPC()
  const { data } = useSuspenseQuery(orpc.post.getAll.queryOptions())

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {data.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
