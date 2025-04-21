import { publicProcedure } from '@/server/api/orpc'

export const postRouter = {
  all: publicProcedure.handler(async ({ context }) => {
    return context.db.query.post.findMany()
  }),
}
