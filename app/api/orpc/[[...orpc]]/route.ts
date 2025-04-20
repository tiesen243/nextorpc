import type { NextRequest } from 'next/server'
import { RPCHandler } from '@orpc/server/fetch'
import { CORSPlugin } from '@orpc/server/plugins'

import { createORPCContext } from '@/server/api/orpc'
import { appRouter } from '@/server/api/root'

const handler = new RPCHandler(appRouter, {
  plugins: [new CORSPlugin()],
})

async function orpcHandler(req: NextRequest): Promise<Response> {
  const { response } = await handler.handle(req, {
    prefix: '/api/orpc',
    context: await createORPCContext({ headers: req.headers }),
  })

  return response ?? new Response('Not Found', { status: 404 })
}

export { orpcHandler as GET, orpcHandler as POST, orpcHandler as OPTIONS }
