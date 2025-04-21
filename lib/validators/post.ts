import { z } from 'zod'

export const byIdSchema = z.object({ id: z.string() })

export const createPostSchema = z.object({
  title: z.string(),
  content: z.string(),
})
