import { publicProcedure } from '@/server/api/orpc'

export const postRouter = {
  getAll: publicProcedure.handler(async ({ context }) => {
    return context.db.query.post.findMany()
  }),
}
