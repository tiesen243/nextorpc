import { desc, eq } from 'drizzle-orm'

import { byIdSchema, createPostSchema } from '@/lib/validators/post'
import { protectedProcedure, publicProcedure } from '@/server/api/orpc'
import { post as postTable } from '@/server/db/schema/post'

export const postRouter = {
  all: publicProcedure.handler(async ({ context }) => {
    return context.db.query.post.findMany({
      orderBy: [desc(postTable.createdAt)],
    })
  }),

  create: protectedProcedure
    .input(createPostSchema)
    .handler(async ({ input, context }) => {
      await context.db.insert(postTable).values({
        title: input.title,
        content: input.content,
        authorId: context.session.user.id ?? '',
      })
    }),

  delete: protectedProcedure
    .input(byIdSchema)
    .handler(async ({ input, context }) => {
      await context.db.delete(postTable).where(eq(postTable.id, input.id))
    }),
}
